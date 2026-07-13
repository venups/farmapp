from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "tripforge"

    # JWT
    jwt_secret_key: str = "tripforge-super-secret-key-change-in-production-2024"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # Server
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    frontend_url: str = "http://localhost:5173"

    # Uploads
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


settings = Settings()
