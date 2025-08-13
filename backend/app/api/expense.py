from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core import SessionLocal
from app.models import Expense, Policy
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

    # Use AI to categorize if not already specified
    if not expense.category:
        expense.category = categorize_expense(expense.dict())

    is_flagged, flag_reason, is_approved = check_expense_against_policies(expense.dict(), policies)

    expense_data = expense.dict()
    expense_data["is_flagged"] = is_flagged
    expense_data["flag_reason"] = flag_reason
    expense_data["is_approved"] = not is_flagged if is_approved is None else is_approved

    return create_expense(db, ExpenseCreate(**expense_data))

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

    content = await file.read()
    content_str = content.decode('utf-8')

    policies = get_policies(db)

    stats = process_csv(db, user_id, content_str, policies, categorize_expense)

    return stats