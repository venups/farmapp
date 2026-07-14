from fastapi import HTTPException

class TripForgeException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

class NotFoundException(TripForgeException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(404, detail)

class UnauthorizedException(TripForgeException):
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(401, detail)

class ForbiddenException(TripForgeException):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(403, detail)

class BadRequestException(TripForgeException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(400, detail)

class ConflictException(TripForgeException):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(409, detail)
