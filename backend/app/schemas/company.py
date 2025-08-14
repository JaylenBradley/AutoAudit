from pydantic import BaseModel
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    description: str | None = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: str | None = None
    description: str | None = None

class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True