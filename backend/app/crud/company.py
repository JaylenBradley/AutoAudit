from sqlalchemy.orm import Session
from app.models import Company
from app.schemas import CompanyCreate, CompanyUpdate

def create_company(db: Session, company: CompanyCreate):
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def get_companies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Company).offset(skip).limit(limit).all()

def get_company(db: Session, id: int):
    return db.query(Company).filter(Company.id == id).first()

def get_company_by_name(db: Session, name: str):
    return db.query(Company).filter(Company.name == name).first()

def update_company(db: Session, id: int, company_data: CompanyUpdate):
    db_company = db.query(Company).filter(Company.id == id).first()
    if not db_company:
        return None

    for field, value in company_data.dict(exclude_unset=True).items():
        if hasattr(db_company, field):
            setattr(db_company, field, value)

    db.commit()
    db.refresh(db_company)
    return db_company

def delete_company(db: Session, id: int):
    db_company = db.query(Company).filter(Company.id == id).first()
    if not db_company:
        return False

    db.delete(db_company)
    db.commit()
    return True

def get_company_users(db: Session, company_id: int, skip: int = 0, limit: int = 100):
    return db.query(Company).filter(Company.id == company_id).first().users[skip:skip + limit]

def get_company_expenses(db: Session, company_id: int, skip: int = 0, limit: int = 100):
    return db.query(Company).filter(Company.id == company_id).first().expenses[skip:skip + limit]