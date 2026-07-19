"""Store selection and snapshot persistence.

The rest of the app only sees a DocumentStore, which wraps a Mongo-API
database object. That object is either a real ``pymongo`` database (when
MONGODB_URI is set) or an in-process ``mongomock`` database. In the
in-process case every mutation is snapshotted to a JSON file so data
survives backend restarts.
"""

import json
import threading
from pathlib import Path
from typing import Optional

from .config import Settings

COLLECTIONS = ("trips", "itinerary_days", "budget_items", "checklist_items")


class DocumentStore:
    def __init__(self, db, snapshot_path: Optional[Path] = None):
        self.db = db
        self.snapshot_path = snapshot_path
        self._lock = threading.Lock()
        if snapshot_path is not None and snapshot_path.exists():
            self._load()

    def _load(self) -> None:
        data = json.loads(self.snapshot_path.read_text())
        for name in COLLECTIONS:
            docs = data.get(name, [])
            if docs:
                self.db[name].insert_many(docs)

    def persist(self) -> None:
        if self.snapshot_path is None:
            return
        with self._lock:
            data = {name: list(self.db[name].find({})) for name in COLLECTIONS}
            self.snapshot_path.parent.mkdir(parents=True, exist_ok=True)
            tmp = self.snapshot_path.with_suffix(".tmp")
            tmp.write_text(json.dumps(data, indent=1))
            tmp.replace(self.snapshot_path)


def build_store(settings: Settings) -> DocumentStore:
    if settings.mongodb_uri:
        from pymongo import MongoClient

        client = MongoClient(settings.mongodb_uri)
        return DocumentStore(client[settings.mongodb_db])

    import mongomock

    client = mongomock.MongoClient()
    return DocumentStore(client[settings.mongodb_db], snapshot_path=settings.data_path)
