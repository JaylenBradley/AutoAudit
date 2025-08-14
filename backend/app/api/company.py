from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core import SessionLocal
from app.models import Company
from app.schemas import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
    UserResponse,
    ExpenseResponse
)
from app.crud import (
    create_company,
    get_companies,
    get_company,
    update_company,
    delete_company,
    get_company_users,
    get_company_expenses
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/companies", response_model=CompanyResponse)
def create_company_route(data: CompanyCreate, db: Session = Depends(get_db)):
    try:
        company = create_company(db, data)
        return company
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Company already exists")

@router.get("/companies", response_model=list[CompanyResponse])
def get_companies_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    companies = get_companies(db, skip, limit)
    return companies

@router.get("/companies/{id}", response_model=CompanyResponse)
def get_company_route(id: int, db: Session = Depends(get_db)):
    company = get_company(db, id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.patch("/companies/{id}", response_model=CompanyResponse)
def update_company_route(id: int, company_data: CompanyUpdate, db: Session = Depends(get_db)):
    company = update_company(db, id, company_data)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.delete("/companies/{id}")
def delete_company_route(id: int, db: Session = Depends(get_db)):
    company = get_company(db, id)
    if not company:
        return Response(status_code=204)

    success = delete_company(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"detail": "Company deleted"}

@router.get("/companies/{id}/users", response_model=list[UserResponse])
def get_company_users_route(id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    company = get_company(db, id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    users = get_company_users(db, id, skip, limit)
    return users

@router.get("/companies/{id}/expenses", response_model=list[ExpenseResponse])
def get_company_expenses_route(id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    company = get_company(db, id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    expenses = get_company_expenses(db, id, skip, limit)
    return expenses