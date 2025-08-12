from firebase_admin import auth
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate, UserResponse, UserUpdate

def create_user(db: Session, user: UserCreate):
