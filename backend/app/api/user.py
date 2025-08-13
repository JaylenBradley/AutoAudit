from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core import SessionLocal
from app.models import User
from app.schemas import UserCreate, UserResponse, UserUpdate
from app.crud import create_user, get_users, get_user, update_user, delete_user, get_user_by_firebase_id

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users", response_model=UserResponse)
def create_user_route(data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = create_user(db, data)
        return user
    except IntegrityError:
        db.rollback()
        existing = get_user_by_firebase_id(db, data.firebase_id)
        if existing:
            return existing
        raise HTTPException(status_code=409, detail="User already exists")

@router.get("/users", response_model=list[UserResponse])
def get_users_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip, limit)

    if not users:
        raise HTTPException(status_code=404, detail="There are no users")

    return users

@router.get("/users/firebase/{firebase_id}", response_model=UserResponse)
def get_user_by_firebase_id_route(firebase_id: str, db: Session = Depends(get_db)):
    user = get_user_by_firebase_id(db, firebase_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.get("/users/{id}", response_model=UserResponse)
def get_user_route(id: int, db: Session = Depends(get_db)):
    user = get_user(db, id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.patch("/users/{id}", response_model=UserResponse)
def update_user_route(id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    user = update_user(db, id, user_data.dict(exclude_unset=True))

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.delete("/users/{id}")
def delete_user_route(id: int, db: Session = Depends(get_db)):
    user = get_user(db, id)

    if not user:
        return Response(status_code=204)

    success = delete_user(db, id, user.firebase_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")

    return {"detail": "User deleted"}