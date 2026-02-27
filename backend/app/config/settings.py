from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "FitQuest"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+asyncpg://fitquest:fitquest_secret@localhost:5432/fitquest"
    REDIS_URL: str = "redis://localhost:6379/0"

    SECRET_KEY: str = "fitquest-dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    CORS_ORIGINS: list[str] = ["http://localhost:3600", "http://127.0.0.1:3600"]

    XP_PER_MINUTE: int = 10
    STREAK_BONUS_MULTIPLIER: float = 0.1
    MAX_STREAK_BONUS: float = 2.0

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
