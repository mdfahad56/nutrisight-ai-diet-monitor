from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models import Meal, MealItem, Alert, DietaryLimit, RestrictedFood
FIELDS={"calories":"daily_calories","protein":"protein_limit","carbohydrates":"carbohydrate_limit","fat":"fat_limit","sugar":"sugar_limit"}
def daily_totals(db,user_id,day=None):
    day=day or date.today()
    result=db.query(*[func.coalesce(func.sum(getattr(MealItem,k)),0).label(k) for k in FIELDS]).join(Meal).filter(Meal.user_id==user_id,Meal.meal_date==day).one()
    return {k:round(float(getattr(result,k)),1) for k in FIELDS}
def evaluate(db,user_id,day=None):
    day=day or date.today(); totals=daily_totals(db,user_id,day); limits=db.query(DietaryLimit).filter_by(user_id=user_id).first()
    if not limits:return totals
    db.query(Alert).filter(Alert.user_id==user_id,Alert.alert_type.in_(["nutrition_warning","nutrition_exceeded"]),func.date(Alert.created_at)==day).delete(synchronize_session=False)
    for nutrient,limit_attr in FIELDS.items():
        limit=getattr(limits,limit_attr); ratio=totals[nutrient]/limit if limit else 0
        if ratio>=1: db.add(Alert(user_id=user_id,alert_type="nutrition_exceeded",severity="high",message=f"{nutrient.title()} daily limit exceeded ({totals[nutrient]}/{limit})."))
        elif ratio>=.8: db.add(Alert(user_id=user_id,alert_type="nutrition_warning",severity="medium",message=f"{nutrient.title()} is at {round(ratio*100)}% of its daily limit."))
    names=[x.food_name.lower() for x in db.query(RestrictedFood).filter_by(user_id=user_id)]
    if names:
        items=db.query(MealItem).join(Meal).filter(Meal.user_id==user_id,Meal.meal_date==day).all()
        for item in items:
            if any(n in item.food_name.lower() for n in names):
                exists=db.query(Alert).filter_by(user_id=user_id,alert_type="restricted_food").filter(Alert.message.like(f"%{item.food_name}%")).first()
                if not exists: db.add(Alert(user_id=user_id,alert_type="restricted_food",severity="high",message=f"Restricted food logged: {item.food_name}."))
    db.commit(); return totals
