import os
import re
import uuid
from datetime import datetime, timezone


def generate_id() -> str:
    """Generate a short unique ID using uuid4 hex truncated to 12 chars."""
    return uuid.uuid4().hex[:12]


def get_current_timestamp() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


def sanitize_filename(filename: str) -> str:
    """Remove special characters from filenames, keeping the extension."""
    name, ext = os.path.splitext(filename)
    sanitized = re.sub(r"[^\w\s-]", "", name).strip()
    sanitized = re.sub(r"[\s]+", "_", sanitized)
    return f"{sanitized}{ext.lower()}"


def validate_image_file(filename: str) -> bool:
    """Check if file extension is an allowed image type."""
    allowed = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    _, ext = os.path.splitext(filename)
    return ext.lower() in allowed


def format_file_size(size_bytes: int) -> str:
    """Convert bytes to human-readable format (KB, MB)."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
