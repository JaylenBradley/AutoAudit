from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class CategoryEnum(str, Enum):
    GENERAL = "general"
    TRAVEL = "travel"

class ExpenseBase(BaseModel):
    merchant: str
    amount: float
    date: datetime
    description: Optional[str] = None
    category: CategoryEnum = CategoryEnum.GENERAL

class ExpenseCreate(ExpenseBase):
    user_id: int

class ExpenseUpdate(BaseModel):
    merchant: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    category: Optional[CategoryEnum] = None
    is_approved: Optional[bool] = None

class ExpenseBulkUpdate(BaseModel):
    ids: List[int]
    merchant: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    category: Optional[CategoryEnum] = None
    is_approved: Optional[bool] = None

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    is_approved: bool
    is_flagged: bool
    flag_reason: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CSVUploadResponse(BaseModel):
    total_processed: int
    successful: int
    flagged: int