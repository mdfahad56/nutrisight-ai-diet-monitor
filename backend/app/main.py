from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.base import Base,engine,SessionLocal
from app.models import models
from app.services.nutrition import seed_foods
from app.api.routes.api import router
app=FastAPI(title="Diet Monitor API",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=[x.strip() for x in settings.cors_origins.split(",")],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
@app.on_event("startup")
def startup():
    Base.metadata.create_all(engine)
    db=SessionLocal()
    try:seed_foods(db)
    finally:db.close()
app.include_router(router)
@app.get("/health")
def health():return {"status":"ok"}
