import uuid
from datetime import datetime, timezone
from pathlib import Path


def generate_id() -> str:
    """Generate a short unique ID."""
    return uuid.uuid4().hex[:12]


def get_current_timestamp() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


def sanitize_filename(filename: str) -> str:
    """Remove special characters from filename, keep extension."""
    path = Path(filename)
    name = path.stem
    ext = path.suffix

    sanitized_name = "".join(c for c in name if c.isalnum() or c in "._- ").strip()
    sanitized_name = sanitized_name.replace(" ", "_")

    return f"{sanitized_name}{ext}"


def validate_image_file(filename: str) -> bool:
    """Check if file extension is an allowed image type."""
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    return Path(filename).suffix.lower() in allowed_extensions


def format_file_size(size_bytes: int) -> str:
    """Convert bytes to human-readable format."""
    if size_bytes < 1024:
        return f"{size_bytes} bytes"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.2f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"
