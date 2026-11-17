from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.base import get_db
from app.models import User
pwd_context=CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/api/auth/login")
def hash_password(password:str): return pwd_context.hash(password)
def verify_password(password:str, hashed:str): return pwd_context.verify(password,hashed)
def create_token(user_id:int): return jwt.encode({"sub":str(user_id),"exp":datetime.now(timezone.utc)+timedelta(minutes=settings.access_token_expire_minutes)},settings.jwt_secret_key,algorithm="HS256")
def current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db)):
    try: user_id=int(jwt.decode(token,settings.jwt_secret_key,algorithms=["HS256"])["sub"])
    except Exception: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid or expired token")
    user=db.get(User,user_id)
    if not user: raise HTTPException(status_code=401,detail="User not found")
    return user
