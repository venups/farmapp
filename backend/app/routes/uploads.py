from fastapi import APIRouter, Depends, HTTPException, status
import datetime
from pathlib import Path

from app.config import settings
from app.utils.helpers import sanitize_filename, validate_image_file
from app.utils.auth_deps import get_current_user

router = APIRouter()

UPLOAD_DIR = Path(settings.upload_dir)
MAX_SIZE = settings.max_upload_size_mb * 1024 * 1024


@router.post("/image")
async def upload_image(file, current_user = Depends(get_current_user)):
    """Upload an image file."""
    # Validate file type
    if not validate_image_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only image files (jpg, jpeg, png, gif, webp) are allowed")
    
    # Validate file size
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {settings.max_upload_size_mb}MB")
    
    # Generate unique filename
    original_name = Path(file.filename).stem
    sanitized_name = sanitize_filename(original_name)
    ext = Path(file.filename).suffix.lower()
    unique_id = __import__('uuid').uuid4().hex[:8]
    filename = f"{sanitized_name}_{unique_id}{ext}"
    
    # Create date-based directory
    year = str(datetime.datetime.now().year)
    month = str(datetime.datetime.now().month).zfill(2)
    upload_path = UPLOAD_DIR / year / month
    upload_path.mkdir(parents=True, exist_ok=True)
    
    # Save file
    file_path = upload_path / filename
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Build URL path
    url_path = f"/uploads/{year}/{month}/{filename}"
    
    return {"url": url_path, "filename": filename}


@router.delete("/image/{filename}")
async def delete_image(filename: str, current_user = Depends(get_current_user)):
    """Delete an uploaded file."""
    # Security: prevent directory traversal
    if ".." in filename or filename.startswith("/"):
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Verify file is in uploads directory
    try:
        file_path.resolve().relative_to(UPLOAD_DIR.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Cannot delete file outside uploads directory")
    
    import os
    os.remove(file_path)
    
    return {"message": "File deleted successfully"}
