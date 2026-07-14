import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "travel_planner"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
