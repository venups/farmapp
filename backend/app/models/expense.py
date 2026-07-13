from beanie import Document
from datetime import datetime
from typing import Optional, List


class Expense(Document):
    trip_id: str
    title: str
    amount: float = 1.0
    currency: str = "USD"
    category: str
    date: datetime
    paid_by: Optional[str] = None
    split_between: List[str] = []
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: bool = True
    payment_method: Optional[str] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "expenses"
