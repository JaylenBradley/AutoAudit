from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core import Base

class CategoryEnum(str, enum.Enum):
    GENERAL = "general"
    TRAVEL = "travel"
    FOOD = "food"
    LODGING = "lodging"
    TRANSPORTATION = "transportation"
    SUPPLIES = "supplies"
    OTHER = "other"

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    merchant = Column(String)
    amount = Column(Float)
    date = Column(DateTime)
    description = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    category = Column(Enum(CategoryEnum), default=CategoryEnum.GENERAL)
    receipt_image_url = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)
    is_flagged = Column(Boolean, default=False)
    flag_reason = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="expenses")
    user = relationship("User", back_populates="expenses")