from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .repository import Repository
from .routes import dashboard, trips
from .store import DocumentStore, build_store


def create_app(settings: Optional[Settings] = None, store: Optional[DocumentStore] = None) -> FastAPI:
    settings = settings or Settings()
    store = store or build_store(settings)

    app = FastAPI(title="Travel Planner API", version="1.0.0")
    app.state.settings = settings
    app.state.store = store
    app.state.repo = Repository(store)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(trips.router)
    app.include_router(dashboard.router)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
