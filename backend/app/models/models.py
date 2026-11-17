from datetime import datetime, date
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    profile: Mapped["UserProfile"] = relationship(back_populates="user", cascade="all, delete-orphan", uselist=False)
    limits: Mapped["DietaryLimit"] = relationship(back_populates="user", cascade="all, delete-orphan", uselist=False)
    restricted_foods: Mapped[list["RestrictedFood"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    meals: Mapped[list["Meal"]] = relationship(back_populates="user", cascade="all, delete-orphan")
class UserProfile(Base):
    __tablename__="user_profiles"; id: Mapped[int]=mapped_column(primary_key=True); user_id: Mapped[int]=mapped_column(ForeignKey("users.id"), unique=True); age: Mapped[int|None]=mapped_column(Integer, nullable=True); height: Mapped[float|None]=mapped_column(Float, nullable=True); weight: Mapped[float|None]=mapped_column(Float, nullable=True); activity_level: Mapped[str|None]=mapped_column(String(50), nullable=True); dietary_preference: Mapped[str|None]=mapped_column(String(100), nullable=True); user: Mapped[User]=relationship(back_populates="profile")
class DietaryLimit(Base):
    __tablename__="dietary_limits"; id: Mapped[int]=mapped_column(primary_key=True); user_id: Mapped[int]=mapped_column(ForeignKey("users.id"), unique=True); daily_calories: Mapped[float]=mapped_column(Float, default=2000); protein_limit: Mapped[float]=mapped_column(Float, default=75); carbohydrate_limit: Mapped[float]=mapped_column(Float, default=275); fat_limit: Mapped[float]=mapped_column(Float, default=65); sugar_limit: Mapped[float]=mapped_column(Float, default=50); user: Mapped[User]=relationship(back_populates="limits")
class RestrictedFood(Base):
    __tablename__="restricted_foods"; id: Mapped[int]=mapped_column(primary_key=True); user_id: Mapped[int]=mapped_column(ForeignKey("users.id"), index=True); food_name: Mapped[str]=mapped_column(String(120)); user: Mapped[User]=relationship(back_populates="restricted_foods")
class Food(Base):
    __tablename__="foods"; id: Mapped[int]=mapped_column(primary_key=True); food_name: Mapped[str]=mapped_column(String(120), unique=True, index=True); calories_per_100g: Mapped[float]=mapped_column(Float); protein_per_100g: Mapped[float]=mapped_column(Float); carbohydrates_per_100g: Mapped[float]=mapped_column(Float); fat_per_100g: Mapped[float]=mapped_column(Float); sugar_per_100g: Mapped[float]=mapped_column(Float)
class Meal(Base):
    __tablename__="meals"; id: Mapped[int]=mapped_column(primary_key=True); user_id: Mapped[int]=mapped_column(ForeignKey("users.id"), index=True); meal_type: Mapped[str]=mapped_column(String(20)); meal_date: Mapped[date]=mapped_column(Date, default=date.today, index=True); created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow); user: Mapped[User]=relationship(back_populates="meals"); items: Mapped[list["MealItem"]]=relationship(back_populates="meal", cascade="all, delete-orphan")
class MealItem(Base):
    __tablename__="meal_items"; id: Mapped[int]=mapped_column(primary_key=True); meal_id: Mapped[int]=mapped_column(ForeignKey("meals.id")); food_id: Mapped[int|None]=mapped_column(ForeignKey("foods.id"), nullable=True); food_name: Mapped[str]=mapped_column(String(120)); portion_grams: Mapped[float]=mapped_column(Float); calories: Mapped[float]=mapped_column(Float); protein: Mapped[float]=mapped_column(Float); carbohydrates: Mapped[float]=mapped_column(Float); fat: Mapped[float]=mapped_column(Float); sugar: Mapped[float]=mapped_column(Float); confidence_score: Mapped[float|None]=mapped_column(Float, nullable=True); meal: Mapped[Meal]=relationship(back_populates="items")
class Alert(Base):
    __tablename__="alerts"; id: Mapped[int]=mapped_column(primary_key=True); user_id: Mapped[int]=mapped_column(ForeignKey("users.id"), index=True); alert_type: Mapped[str]=mapped_column(String(50)); message: Mapped[str]=mapped_column(String(500)); severity: Mapped[str]=mapped_column(String(20)); is_read: Mapped[bool]=mapped_column(Boolean, default=False); created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)
