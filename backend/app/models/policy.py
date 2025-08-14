from sqlalchemy import Column, String, Integer, DateTime, Enum, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.models.expense import CategoryEnum
from app.core import Base

class PolicyType(str, enum.Enum):
    HARD = "hard"  # Hard block - never allow
    SOFT = "soft"  # Soft block - allowed but reported

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    name = Column(String)
    description = Column(String, nullable=True)
    category = Column(Enum(CategoryEnum))
    rule_type = Column(String)  # e.g., "amount_max", "merchant_blacklist", "item_type"
    rule_value = Column(JSON) # rule_value will be a number for "amount_max" rules or a list for "merchant_blacklist" rules
    policy_type = Column(Enum(PolicyType))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="policies")