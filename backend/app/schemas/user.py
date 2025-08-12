from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr
    login_method: str

class UserCreate(UserBase):
    firebase_id: str

class UserUpdate(BaseModel):
    username: str | None = None

class UserResponse(UserBase):
    id: int
    firebase_id: str

    class Config:
        from_attributes = True