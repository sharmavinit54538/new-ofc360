from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "EduFlow AI"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "sqlite+aiosqlite:///./eduflow.db"

    JWT_SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 25
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    JWT_ISSUER: str | None = None
    JWT_AUDIENCE: str | None = None

    COOKIE_NAME: str = "ofc360_refresh_token"
    COOKIE_DOMAIN: str | None = None
    COOKIE_SAMESITE: str = "lax"
    COOKIE_SECURE: bool | None = None

    CORS_ORIGINS: str = "https://www.ofc360.com,https://ofc360.com,https://app.ofc360.com,http://localhost:5173,http://localhost:4173,http://localhost:3000,http://localhost:8080"

    FACE_RECOGNITION_THRESHOLD: float = 0.55

    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    SEED_ADMIN_PASSWORD: str = "Admin@12345"
    SEED_TEACHER_PASSWORD: str = "Teacher@12345"
    SEED_STUDENT_PASSWORD: str = "Student@12345"
    SEED_PARENT_PASSWORD: str = "Parent@12345"
    SEED_ACCOUNTANT_PASSWORD: str = "Account@12345"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
