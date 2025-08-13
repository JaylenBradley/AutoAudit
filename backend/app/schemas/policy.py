from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any
from enum import Enum
from app.schemas.expense import CategoryEnum

class PolicyType(str, Enum):
    HARD = "hard"
    SOFT = "soft"

class PolicyBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: CategoryEnum
    rule_type: str
    rule_value: Any
    policy_type: PolicyType

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[CategoryEnum] = None
    rule_type: Optional[str] = None
    rule_value: Optional[Any] = None
    policy_type: Optional[PolicyType] = None

class PolicyResponse(PolicyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True