from typing import Literal, Optional
from pydantic import BaseModel, Field


class ChecklistItemBase(BaseModel):
    trip_id: str
    text: str = Field(..., min_length=1)
    item_type: Literal["packing", "prep"] = Field(...)
    checked: bool = False


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItemUpdate(BaseModel):
    text: Optional[str] = None
    item_type: Optional[Literal["packing", "prep"]] = None
    checked: Optional[bool] = None


class ChecklistItemResponse(ChecklistItemBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
