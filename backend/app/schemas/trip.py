from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, source: any, handler: any):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.is_instance_schema(ObjectId),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)),
        )

class ChecklistItemBase(BaseModel):
    content: str
    is_completed: bool = False

class ChecklistItem(ChecklistItemBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), validation_alias="_id")
    model_config = ConfigDict(populate_by_name=True)

class BudgetEntryBase(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class BudgetEntry(BudgetEntryBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), validation_alias="_id")
    model_config = ConfigDict(populate_by_name=True)

class ItineraryItemBase(BaseModel):
    date: str # or datetime
    activity: str
    location: Optional[str] = None

class ItineraryItem(ItineraryItemBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), validation_alias="_id")
    model_config = ConfigDict(populate_by_name=True)

class TripBase(BaseModel):
    destination: str
    start_date: str # or datetime
    end_date: str     # or datetime
    description: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class Trip(TripBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), validation_alias="_id")
    itineraries: List[ItineraryItem] = []
    budgets: List[BudgetEntry] = []
    checklists: List[ChecklistItem] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)
