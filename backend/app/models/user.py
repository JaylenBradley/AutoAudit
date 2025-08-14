from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    firebase_id = Column(String, unique=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    login_method = Column(String)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="users")
    expenses = relationship("Expense", back_populates="user")