from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Ohhh1Mail AI"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@postgres:5432/superhuman"
    
    # Redis
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ENCRYPTION_KEY: str = "X6JMmHYnh_iGl8nO9J_jCsEAHRqL_SC8YkQ0vFHkd-4="
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    
    # AI Services
    OLLAMA_BASE_URL: str = "http://host.docker.internal:11434"
    OLLAMA_MODEL: str = "llama3.2:latest"
    OLLAMA_ENABLED: bool = True
    OLLAMA_TIMEOUT: int = 30
    
    ANTHROPIC_API_KEY: str = ""
    USE_CLAUDE_FALLBACK: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3040", "http://localhost:3000"]
    
    # Email Sync
    EMAIL_SYNC_INTERVAL: int = 30
    EMAIL_BATCH_SIZE: int = 50
    
    # Celery
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/0"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
