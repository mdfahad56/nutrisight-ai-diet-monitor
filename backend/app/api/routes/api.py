from datetime import date, timedelta
from io import BytesIO
from pathlib import Path
import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image, UnidentifiedImageError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.base import get_db
from app.models import User,UserProfile,DietaryLimit,RestrictedFood,Meal,MealItem,Alert
from app.schemas.schemas import RegisterIn,LoginIn,TokenOut,ProfileIn,LimitsIn,MealIn
from app.core.security import hash_password,verify_password,create_token,current_user
from app.services.nutrition import find_food,calculate
from app.services.restrictions import evaluate,daily_totals,FIELDS
from app.ai.inference import predict_food
router=APIRouter(prefix="/api")
logger = logging.getLogger(__name__)
def serialize_meal(m): return {"id":m.id,"meal_type":m.meal_type,"meal_date":m.meal_date,"created_at":m.created_at,"items":[{"id":i.id,"food_name":i.food_name,"portion_grams":i.portion_grams,"calories":i.calories,"protein":i.protein,"carbohydrates":i.carbohydrates,"fat":i.fat,"sugar":i.sugar,"confidence_score":i.confidence_score} for i in m.items]}
@router.post("/auth/register",response_model=TokenOut)
def register(body:RegisterIn,db:Session=Depends(get_db)):
    email = body.email.lower()
    try:
        if db.query(User).filter_by(email=email).first():
            raise HTTPException(409, "Email already registered")
        user = User(name=body.name, email=email, hashed_password=hash_password(body.password))
        db.add(user)
        db.flush()
        db.add(UserProfile(user_id=user.id))
        db.add(DietaryLimit(user_id=user.id))
        db.commit()
        return {"access_token": create_token(user.id)}
    except IntegrityError:
        db.rollback()
        # Handles races as well as a database-level unique constraint.
        raise HTTPException(409, "Email already registered")
    except HTTPException:
        raise
    except ValueError:
        db.rollback()
        logger.warning("Registration rejected for email=%s due to invalid data", email)
        raise HTTPException(400, "Invalid registration data")
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error while registering email=%s", email)
        raise HTTPException(500, "Unable to create account. Please try again later.")
    except Exception:
        db.rollback()
        logger.exception("Unexpected registration error for email=%s", email)
        raise HTTPException(500, "Unable to create account. Please try again later.")
@router.post("/auth/login",response_model=TokenOut)
def login(body:LoginIn,db:Session=Depends(get_db)):
    u=db.query(User).filter_by(email=body.email.lower()).first()
    if not u or not verify_password(body.password,u.hashed_password): raise HTTPException(401,"Incorrect email or password")
    return {"access_token":create_token(u.id)}
@router.get("/auth/me")
def me(u:User=Depends(current_user)): return {"id":u.id,"name":u.name,"email":u.email}
@router.get("/profile")
def get_profile(u:User=Depends(current_user)): p=u.profile;return {"age":p.age,"height":p.height,"weight":p.weight,"activity_level":p.activity_level,"dietary_preference":p.dietary_preference}
@router.put("/profile")
def put_profile(body:ProfileIn,u:User=Depends(current_user),db:Session=Depends(get_db)):
    p=u.profile
    for k,v in body.model_dump().items():setattr(p,k,v)
    db.commit();return {"message":"Profile updated"}
@router.get("/dietary-settings")
def get_limits(u:User=Depends(current_user)): l=u.limits;return {**{k:getattr(l,k) for k in ["daily_calories","protein_limit","carbohydrate_limit","fat_limit","sugar_limit"]},"restricted_foods":[x.food_name for x in u.restricted_foods]}
@router.put("/dietary-settings")
def put_limits(body:LimitsIn,u:User=Depends(current_user),db:Session=Depends(get_db)):
    for k,v in body.model_dump(exclude={"restricted_foods"}).items():setattr(u.limits,k,v)
    db.query(RestrictedFood).filter_by(user_id=u.id).delete();db.add_all([RestrictedFood(user_id=u.id,food_name=x.strip()) for x in body.restricted_foods if x.strip()]);db.commit();evaluate(db,u.id);return {"message":"Dietary settings updated"}
@router.post("/meals")
def create_meal(body:MealIn,u:User=Depends(current_user),db:Session=Depends(get_db)):
    m=Meal(user_id=u.id,meal_type=body.meal_type,meal_date=body.meal_date);db.add(m);db.flush()
    for entry in body.items:
        food=find_food(db,entry.food_name)
        if not food: raise HTTPException(422,f"Unknown food: {entry.food_name}. Select a recognized database food.")
        n=calculate(food,entry.portion_grams);db.add(MealItem(meal_id=m.id,food_id=food.id,food_name=food.food_name,portion_grams=entry.portion_grams,confidence_score=entry.confidence_score,**n))
    db.commit();evaluate(db,u.id,body.meal_date);db.refresh(m);return serialize_meal(m)
@router.get("/meals")
def list_meals(day:date|None=None,u:User=Depends(current_user),db:Session=Depends(get_db)):
    q=db.query(Meal).filter_by(user_id=u.id)
    if day:q=q.filter_by(meal_date=day)
    return [serialize_meal(m) for m in q.order_by(Meal.created_at.desc()).all()]
@router.get("/meals/{meal_id}")
def get_meal(meal_id:int,u:User=Depends(current_user),db:Session=Depends(get_db)):
    m=db.query(Meal).filter_by(id=meal_id,user_id=u.id).first()
    if not m:raise HTTPException(404,"Meal not found")
    return serialize_meal(m)
@router.put("/meals/{meal_id}")
def update_meal(meal_id:int,body:MealIn,u:User=Depends(current_user),db:Session=Depends(get_db)):
    m=db.query(Meal).filter_by(id=meal_id,user_id=u.id).first()
    if not m:raise HTTPException(404,"Meal not found")
    old=m.meal_date;m.meal_type=body.meal_type;m.meal_date=body.meal_date;m.items.clear()
    for e in body.items:
        f=find_food(db,e.food_name)
        if not f:raise HTTPException(422,f"Unknown food: {e.food_name}")
        m.items.append(MealItem(food_id=f.id,food_name=f.food_name,portion_grams=e.portion_grams,confidence_score=e.confidence_score,**calculate(f,e.portion_grams)))
    db.commit();evaluate(db,u.id,old);evaluate(db,u.id,body.meal_date);return serialize_meal(m)
@router.delete("/meals/{meal_id}")
def delete_meal(meal_id:int,u:User=Depends(current_user),db:Session=Depends(get_db)):
    m=db.query(Meal).filter_by(id=meal_id,user_id=u.id).first()
    if not m:raise HTTPException(404,"Meal not found")
    d=m.meal_date;db.delete(m);db.commit();evaluate(db,u.id,d);return {"message":"Meal deleted"}
@router.get("/nutrition/daily")
def daily(day:date|None=None,u:User=Depends(current_user),db:Session=Depends(get_db)):
    day=day or date.today(); totals=daily_totals(db,u.id,day);l=u.limits; limits={"calories":l.daily_calories,"protein":l.protein_limit,"carbohydrates":l.carbohydrate_limit,"fat":l.fat_limit,"sugar":l.sugar_limit};return {"date":day,"totals":totals,"limits":limits,"remaining":{k:round(max(0,limits[k]-totals[k]),1) for k in totals}}
@router.get("/nutrition/weekly")
def weekly(u:User=Depends(current_user),db:Session=Depends(get_db)):
    today=date.today(); output=[]
    for i in range(6,-1,-1):
        d=today-timedelta(days=i);output.append({"date":d.isoformat(),**daily_totals(db,u.id,d)})
    return output
@router.get("/alerts")
def alerts(u:User=Depends(current_user),db:Session=Depends(get_db)): return [{"id":a.id,"type":a.alert_type,"message":a.message,"severity":a.severity,"is_read":a.is_read,"created_at":a.created_at} for a in db.query(Alert).filter_by(user_id=u.id).order_by(Alert.created_at.desc()).limit(50)]
@router.put("/alerts/{alert_id}/read")
def read_alert(alert_id:int,u:User=Depends(current_user),db:Session=Depends(get_db)):
    a=db.query(Alert).filter_by(id=alert_id,user_id=u.id).first()
    if not a:raise HTTPException(404,"Alert not found")
    a.is_read=True;db.commit();return {"message":"Alert marked read"}
@router.post("/food/recognize")
async def recognize(image:UploadFile=File(...),u:User=Depends(current_user)):
    if image.content_type not in {"image/jpeg","image/png","image/webp"}:raise HTTPException(415,"Upload a JPEG, PNG, or WebP image")
    raw=await image.read()
    if len(raw)>8*1024*1024:raise HTTPException(413,"Image must be 8 MB or smaller")
    try:
        img=Image.open(BytesIO(raw));img.verify();img=Image.open(BytesIO(raw)).convert("RGB")
    except (UnidentifiedImageError,OSError):raise HTTPException(422,"Invalid image file")
    return predict_food(img)
