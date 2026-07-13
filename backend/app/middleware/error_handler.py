from fastapi import Request, Response
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import logging
from app.utils.exceptions import TripForgeException

logger = logging.getLogger(__name__)

async def tripforge_exception_handler(request: Request, exc: TripForgeException):
    """Handler for custom TripForge exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "detail": exc.detail,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Handler for all other unhandled exceptions."""
    logger.exception("Unhandled exception occurred")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "status_code": 500,
            "detail": "An internal server error occurred",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )
