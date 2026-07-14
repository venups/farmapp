from fastapi import Request
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
from app.utils.exceptions import TripForgeException
import logging

logger = logging.getLogger(__name__)

async def tripforge_exception_handler(request: Request, exc: TripForgeException):
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
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "status_code": 500,
            "detail": "An internal server error occurred",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )
