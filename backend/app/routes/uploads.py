import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from app.config import settings
from app.utils.helpers import sanitize_filename, validate_image_file
from app.utils.auth_deps import get_current_user

router = APIRouter()

@router.post("/image")
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not validate_image_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only jpg, jpeg, png, gif, webp are allowed.")
    
    # Check file size (approximate)
    contents = await file.read()
    if len(contents) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File too large. Max size is {settings.max_upload_size_mb}MB")
    
    # Reset file pointer after reading for size check
    await file.seek(0)
    
    # Create directory structure: uploads/YYYY/MM/
    from datetime import datetime
    now = datetime.utcnow()
    rel_dir = f"{now.year}/{now.strftime('%m')}"
    full_dir = os.path.join(settings.upload_dir, rel_dir)
    os.makedirs(full_dir, exist_ok=True)
    
    # Generate unique filename
    safe_name = sanitize_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{safe_name}"
    file_path = os.path.join(full_dir, unique_name)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        while content := await file.read(1024 * 1024):
            await out_file.write(content)
    
    # Return URL relative to the /uploads mount point
    url = f"/uploads/{rel_dir}/{unique_name}"
    return {"url": url, "filename": unique_name}

@router.delete("/image/{filename}")
async def delete_image(filename: str, current_user: dict = Depends(get_current_user)):
    # In a real app, we'd verify the user owns the image. 
    # For now, we search for the file in the uploads directory and delete it.
    found = False
    for root, dirs, files in os.walk(settings.upload_dir):
        if filename in files:
            os.remove(os.path.join(root, filename))
            found = True
            break
    
    if not found:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {"message": "File deleted successfully"}
