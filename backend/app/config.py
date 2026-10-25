"""Application settings loaded from environment / .env file."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Groq
    groq_api_key: str = ""

    # Database (SQLite)
    sqlite_db_path: str = "kickskill.db"

    # Auth & Security
    secret_key: str = "stark-kickskill-secret-jwt-key-2026"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # CORS
    frontend_url: str = "http://localhost:5173"

    # Models
    chat_model: str = "llama-3.3-70b-versatile"
    fast_model: str = "llama-3.1-8b-instant"


settings = Settings()
