from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URL, MONGO_DB

_client = None
_db = None


def get_client():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URL)
    return _client


def get_db():
    global _db
    if _db is None:
        _db = get_client()[MONGO_DB]
    return _db


def reset():
    global _client, _db
    if _client:
        _client.close()
    _client = None
    _db = None
