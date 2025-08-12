from sqlalchemy.orm import Session
from app.models import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate


def create_policy(db: Session, policy: PolicyCreate):
    db_policy = Policy(**policy.dict())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy


def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Policy).offset(skip).limit(limit).all()


def get_policy(db: Session, policy_id: int):
    return db.query(Policy).filter(Policy.id == policy_id).first()


def update_policy(db: Session, policy_id: int, policy_data: dict):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not db_policy:
        return None

    for field, value in policy_data.items():
        if hasattr(db_policy, field):
            setattr(db_policy, field, value)

    db.commit()
    db.refresh(db_policy)
    return db_policy


def delete_policy(db: Session, policy_id: int):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not db_policy:
        return False

    db.delete(db_policy)
    db.commit()
    return True