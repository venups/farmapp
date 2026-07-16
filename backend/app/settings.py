from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "travel_planner"
    USE_MONGO_MEMORY_SERVER: bool = False
    BACKEND_PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
