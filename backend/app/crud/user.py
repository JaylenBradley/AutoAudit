from firebase_admin import auth
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate

def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(User).all()

def get_user(db: Session, id: int):
    return db.query(User).filter(User.id == id).first()

def get_user_by_firebase_id(db: Session, firebase_id: str):
    return db.query(User).filter(User.firebase_id == firebase_id).first()

def update_user(db: Session, id: int, user_data: dict):
    db_user = db.query(User).filter(User.id == id).first()
    if not db_user:
        return None

    for field, value in user_data.items():
        if hasattr(db_user, field):
            setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, id: int, firebase_id: str):
    try:
        auth.delete_user(firebase_id)
    except Exception as e:
        pass

    db_user = db.query(User).filter(User.id == id).first()
    if not db_user:
        return False

    db.delete(db_user)
    db.commit()
    return True