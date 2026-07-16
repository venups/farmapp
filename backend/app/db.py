from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

from app.settings import settings


class Database:
    client = None
    db = None

    @classmethod
    async def connect(cls):
        if settings.USE_MONGO_MEMORY_SERVER or settings.DATABASE_URL == "mongomock://":
            # Will be set up by test fixtures
            from mongomock import MongoClient
            cls.client = MongoClient()
            cls.db = cls.client[settings.DATABASE_NAME]
        else:
            try:
                cls.client = AsyncIOMotorClient(settings.DATABASE_URL)
                cls.db = cls.client[settings.DATABASE_NAME]
                # Test connection
                await cls.client.admin.command("ping")
            except ConnectionFailure:
                # Fallback to mongomock if connection fails
                from mongomock import MongoClient
                cls.client = MongoClient()
                cls.db = cls.client[settings.DATABASE_NAME]

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()


def get_db():
    return Database.db
