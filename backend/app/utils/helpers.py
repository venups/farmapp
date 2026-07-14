import uuid
from datetime import datetime, timezone
import re
import os

def generate_id() -> str:
    """Generates a short unique ID."""
    return uuid.uuid4().hex[:12]

def get_current_timestamp() -> datetime:
    """Returns current UTC datetime."""
    return datetime.now(timezone.utc)

def sanitize_filename(filename: str) -> str:
    """Removes special characters from filenames, keeps extension."""
    name, ext = os.path.splitext(filename)
    name = re.sub(r'[^a-zA-Z0-9_-]', '_', name)
    return f"{name}{ext}"

def validate_image_file(filename: str) -> bool:
    """Checks if file extension is an allowed image type."""
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    _, ext = os.path.splitext(filename.lower())
    return ext in allowed_extensions

def format_file_size(size_bytes: int) -> str:
    """Converts bytes to human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"
