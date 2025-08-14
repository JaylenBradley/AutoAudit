from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    login_method: str

class UserCreate(UserBase):
    firebase_id: str
    role: UserRole = UserRole.EMPLOYEE
    company_id: int | None = None

class UserUpdate(BaseModel):
    username: str | None = None
    role: UserRole | None = None
    company_id: int | None = None

class UserResponse(UserBase):
    id: int
    firebase_id: str
    role: UserRole
    company_id: int | None = None
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True