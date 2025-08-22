from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core import SessionLocal
from app.models import Expense, Policy, User
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseBulkUpdate, CSVUploadResponse
from app.crud.expense import (
    create_expense,
    get_expenses,
    get_user_expenses,
    get_expense,
    get_flagged_expenses,
    update_expense,
    bulk_update_expenses,
    delete_expense,
    process_csv,
    check_expense_against_policies
)
from app.crud.policy import get_policies
from app.utils.ai import categorize_expense

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/expenses", response_model=ExpenseResponse)
def create_expense_route(expense: ExpenseCreate, db: Session = Depends(get_db)):
    policies = get_policies(db)
    return create_expense(db, expense, policies=policies, categorize_func=categorize_expense)

@router.get("/expenses", response_model=List[ExpenseResponse])
def get_expenses_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    expenses = get_expenses(db, skip, limit)
    return expenses

@router.get("/users/{user_id}/expenses", response_model=List[ExpenseResponse])
def get_user_expenses_route(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    expenses = get_user_expenses(db, user_id, skip, limit)
    return expenses

@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
def get_expense_route(expense_id: int, db: Session = Depends(get_db)):
    expense = get_expense(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.get("/expenses/flagged", response_model=List[ExpenseResponse])
def get_flagged_expenses_route(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_flagged_expenses(db, skip=skip, limit=limit)

@router.get("/users/{user_id}/expenses/flagged", response_model=List[ExpenseResponse])
def get_user_flagged_expenses_route(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_flagged_expenses(db, user_id=user_id, skip=skip, limit=limit)

@router.patch("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense_route(expense_id: int, expense_data: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = update_expense(db, expense_id, expense_data.dict(exclude_unset=True))
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.patch("/expenses/bulk", response_model=List[ExpenseResponse])
def bulk_update_expenses_route(update_data: ExpenseBulkUpdate, db: Session = Depends(get_db)):
    update_dict = update_data.dict(exclude={"ids"}, exclude_unset=True)
    expenses = bulk_update_expenses(db, update_data.ids, update_dict)
    return expenses

@router.delete("/expenses/{expense_id}")
def delete_expense_route(expense_id: int, db: Session = Depends(get_db)):
    success = delete_expense(db, expense_id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"detail": "Expense deleted"}


@router.post("/users/{user_id}/upload-expenses", response_model=CSVUploadResponse)
async def upload_expenses_route(
        user_id: int,
        file: UploadFile = File(...),
        db: Session = Depends(get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    company_id = user.company_id
    if not company_id:
        raise HTTPException(status_code=400, detail="User is not associated with a company")

    content = await file.read()
    content_str = content.decode('utf-8')

    policies = get_policies(db)

    stats = process_csv(db, user_id, company_id, content_str, policies, categorize_expense)

    return stats