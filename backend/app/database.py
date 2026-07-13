from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
import logging

logger = logging.getLogger(__name__)

client = None


async def init_db():
    """Initialize MongoDB connection and Beanie ODM."""
    global client
    try:
        client = AsyncIOMotorClient(settings.mongodb_url)
        db = client[settings.database_name]

        from app.models.user import User
        from app.models.trip import Trip
        from app.models.activity import Activity
        from app.models.expense import Expense
        from app.models.packing_item import PackingItem

        await init_beanie(
            database=db,
            document_models=[User, Trip, Activity, Expense, PackingItem],
        )
        logger.info(f"Connected to MongoDB: {settings.database_name}")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        logger.warning("App will start without database. API calls will fail.")


async def get_client():
    """Get the MongoDB client instance."""
    return client
