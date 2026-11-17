from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    database_url: str = f"sqlite:///{ROOT / 'diet_monitor.db'}"
    jwt_secret_key: str = "development-only-change-this-secret"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    model_path: str = str(ROOT / "ai_model" / "saved_models" / "food_classifier.keras")
    model_config = SettingsConfigDict(env_file=ROOT / "backend" / ".env", extra="ignore")

settings = Settings()
