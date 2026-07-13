from fastapi import APIRouter, Depends, UploadFile, File, status
from fastapi.responses import JSONResponse
import uuid
import os
from datetime import datetime

from app.models.user import User
from app.config import settings
from app.utils.helpers import sanitize_filename, validate_image_file
from app.utils.auth_deps import get_current_user

router = APIRouter()


@router.post("/image", response_model=dict)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not validate_image_file(file.filename):
        return JSONResponse(
            status_code=400,
            content={
                "error": True,
                "status_code": 400,
                "detail": "Invalid file type. Allowed: jpg, jpeg, png, gif, webp",
            },
        )

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.max_upload_size_mb:
        return JSONResponse(
            status_code=400,
            content={
                "error": True,
                "status_code": 400,
                "detail": f"File too large. Max size: {settings.max_upload_size_mb}MB",
            },
        )

    unique_name = f"{uuid.uuid4().hex}_{sanitize_filename(file.filename)}"
    date_dir = datetime.now().strftime("%Y/%m")
    upload_path = os.path.join(settings.upload_dir, date_dir)
    os.makedirs(upload_path, exist_ok=True)

    file_path = os.path.join(upload_path, unique_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    url = f"/uploads/{date_dir}/{unique_name}"
    return {"url": url, "filename": unique_name}


@router.delete("/image/{filename}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(filename: str, current_user: User = Depends(get_current_user)):
    search_path = os.path.join(settings.upload_dir, filename.lstrip("/uploads/"))
    if os.path.exists(search_path):
        os.remove(search_path)
    return None
