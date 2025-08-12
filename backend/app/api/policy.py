from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core import SessionLocal
from app.schemas.policy import PolicyCreate, PolicyUpdate, PolicyResponse
from app.crud.policy import create_policy, get_policies, get_policy, update_policy, delete_policy

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/policies", response_model=PolicyResponse)
def create_policy_route(policy: PolicyCreate, db: Session = Depends(get_db)):
    return create_policy(db, policy)

@router.get("/policies", response_model=List[PolicyResponse])
def get_policies_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = get_policies(db, skip, limit)
    return policies

@router.get("/policies/{policy_id}", response_model=PolicyResponse)
def get_policy_route(policy_id: int, db: Session = Depends(get_db)):
    policy = get_policy(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.patch("/policies/{policy_id}", response_model=PolicyResponse)
def update_policy_route(policy_id: int, policy_data: PolicyUpdate, db: Session = Depends(get_db)):
    policy = update_policy(db, policy_id, policy_data.dict(exclude_unset=True))
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.delete("/policies/{policy_id}")
def delete_policy_route(policy_id: int, db: Session = Depends(get_db)):
    success = delete_policy(db, policy_id)
    if not success:
        raise HTTPException(status_code=404, detail="Policy not found")
    return {"detail": "Policy deleted"}