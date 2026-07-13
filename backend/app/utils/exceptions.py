from fastapi import HTTPException

class TripForgeException(Exception):
    """Base exception for TripForge application."""
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

class NotFoundException(TripForgeException):
    """404 Not Found"""
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(404, detail)

class UnauthorizedException(TripForgeException):
    """401 Unauthorized"""
    def __init__(self, detail: str = "Authentication required"):
        super().__init__(401, detail)

class ForbiddenException(TripForgeException):
    """403 Forbidden"""
    def __init__(self, detail: str = "Permission denied"):
        super().__init__(403, detail)

class BadRequestException(TripForgeException):
    """400 Bad Request"""
    def __init__(self, detail: str = "Invalid request"):
        super().__init__(400, detail)

class ConflictException(TripForgeException):
    """409 Conflict"""
    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(409, detail)
