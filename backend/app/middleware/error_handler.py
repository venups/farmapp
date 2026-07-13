from datetime import datetime, timezone
from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.utils.exceptions import (
    TripForgeException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    ConflictException,
)


async def tripforge_exception_handler(request: Request, exc: TripForgeException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "detail": exc.detail,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": 500,
            "detail": "Internal server error",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


def register_exception_handlers(app):
    app.add_exception_handler(TripForgeException, tripforge_exception_handler)
    app.add_exception_handler(NotFoundException, tripforge_exception_handler)
    app.add_exception_handler(UnauthorizedException, tripforge_exception_handler)
    app.add_exception_handler(ForbiddenException, tripforge_exception_handler)
    app.add_exception_handler(BadRequestException, tripforge_exception_handler)
    app.add_exception_handler(ConflictException, tripforge_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
