class TripForgeException(Exception):
    """Base exception with status_code and detail."""

    def __init__(self, status_code: int = 500, detail: str = "Internal server error"):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


class NotFoundException(TripForgeException):
    def __init__(self, detail: str = "Not found"):
        super().__init__(status_code=404, detail=detail)


class UnauthorizedException(TripForgeException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(status_code=401, detail=detail)


class ForbiddenException(TripForgeException):
    def __init__(self, detail: str = "Forbidden"):
        super().__init__(status_code=403, detail=detail)


class BadRequestException(TripForgeException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=400, detail=detail)


class ConflictException(TripForgeException):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(status_code=409, detail=detail)
