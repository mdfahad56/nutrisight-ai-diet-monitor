from sqlalchemy.orm import Session
from app.models import Food
SEED_FOODS=[("Roti",297,9.6,55.7,4.5,2.7),("Rice",130,2.7,28.2,.3,.1),("Dal",116,9,20,0.4,1.8),("Paneer",265,18.3,1.2,20.8,1.2),("Chicken",239,27,0,14,.0),("Biryani",180,8,25,6,1.5),("Salad",25,1.5,4,.2,2),("Idli",146,4,28,.7,.3),("Dosa",168,4,28,3,1),("Fruits",60,.7,15,.2,12),("Vegetables",35,2,7,.3,3),("Eggs",155,13,1.1,11,1.1)]
def seed_foods(db:Session):
    for row in SEED_FOODS:
        if not db.query(Food).filter(Food.food_name.ilike(row[0])).first(): db.add(Food(food_name=row[0],calories_per_100g=row[1],protein_per_100g=row[2],carbohydrates_per_100g=row[3],fat_per_100g=row[4],sugar_per_100g=row[5]))
    db.commit()
def calculate(food:Food, grams:float):
    factor=grams/100
    return {"calories":round(food.calories_per_100g*factor,1),"protein":round(food.protein_per_100g*factor,1),"carbohydrates":round(food.carbohydrates_per_100g*factor,1),"fat":round(food.fat_per_100g*factor,1),"sugar":round(food.sugar_per_100g*factor,1)}
def find_food(db:Session,name:str): return db.query(Food).filter(Food.food_name.ilike(name.strip())).first()
