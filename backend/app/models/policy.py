from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.core import Base
from app.models.expense import CategoryEnum

class PolicyType(str, enum.Enum):
    HARD = "hard"  # Hard block - never allow
    SOFT = "soft"  # Soft block - allowed but reported

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    category = Column(Enum(CategoryEnum))
    rule_type = Column(String)  # e.g., "amount_max", "merchant_blacklist", "item_type"
    rule_value = Column(String)  # JSON string for complex rules or simple value
    policy_type = Column(Enum(PolicyType))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())