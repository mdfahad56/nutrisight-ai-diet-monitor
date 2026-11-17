from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Name must contain at least two non-space characters")
        return value
class LoginIn(BaseModel): email: EmailStr; password: str
class TokenOut(BaseModel): access_token: str; token_type: str = "bearer"
class ProfileIn(BaseModel): age: int|None=Field(None, ge=1, le=120); height: float|None=Field(None, ge=30, le=300); weight: float|None=Field(None, ge=2, le=500); activity_level: str|None=None; dietary_preference: str|None=None
class LimitsIn(BaseModel): daily_calories: float=Field(ge=1); protein_limit: float=Field(ge=0); carbohydrate_limit: float=Field(ge=0); fat_limit: float=Field(ge=0); sugar_limit: float=Field(ge=0); restricted_foods: list[str]=[]
class MealItemIn(BaseModel): food_name: str=Field(min_length=1,max_length=120); portion_grams: float=Field(gt=0,le=5000); confidence_score: float|None=Field(None,ge=0,le=1)
class MealIn(BaseModel): meal_type: str=Field(pattern="^(breakfast|lunch|dinner|snacks)$"); meal_date: date; items: list[MealItemIn]=Field(min_length=1)
class MealUpdate(MealIn): pass
