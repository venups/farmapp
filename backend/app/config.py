from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings

REPO_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_port: int = 8000
    mongodb_uri: str = ""
    mongodb_db: str = "travel_planner"
    data_file: str = "backend/data/store.json"
    cors_origins: str = "http://localhost:5173"

    model_config = {"env_file": str(REPO_ROOT / ".env"), "extra": "ignore"}

    @property
    def data_path(self) -> Path:
        path = Path(self.data_file)
        return path if path.is_absolute() else REPO_ROOT / path

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]
