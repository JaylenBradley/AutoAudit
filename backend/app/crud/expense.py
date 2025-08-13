import csv
from io import StringIO
from sqlalchemy.orm import Session
from app.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from datetime import datetime

def create_expense(db: Session, expense: ExpenseCreate):
    db_expense = Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Expense).offset(skip).limit(limit).all()

def get_user_expenses(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Expense).filter(Expense.user_id == user_id).offset(skip).limit(limit).all()

def get_expense(db: Session, expense_id: int):
    return db.query(Expense).filter(Expense.id == expense_id).first()

def get_flagged_expenses(db: Session, user_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(Expense).filter(Expense.is_flagged == True)

    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)

    return query.offset(skip).limit(limit).all()

def update_expense(db: Session, expense_id: int, expense_data: dict):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        return None

    for field, value in expense_data.items():
        if hasattr(db_expense, field):
            setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense

def bulk_update_expenses(db: Session, expense_ids: list[int], expense_data: dict):
    updated_expenses = []

    for expense_id in expense_ids:
        db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if db_expense:
            for field, value in expense_data.items():
                if hasattr(db_expense, field) and value is not None:
                    setattr(db_expense, field, value)
            updated_expenses.append(db_expense)

    db.commit()
    for expense in updated_expenses:
        db.refresh(expense)

    return updated_expenses

def delete_expense(db: Session, expense_id: int):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        return False

    db.delete(db_expense)
    db.commit()
    return True

def process_csv(db: Session, user_id: int, file_content: str, policies, categorize_func):
    csv_file = StringIO(file_content)
    reader = csv.DictReader(csv_file)

    stats = {"total_processed": 0, "successful": 0, "flagged": 0}

    for row in reader:
        try:
            expense_data = {
                "user_id": user_id,
                "merchant": row.get("merchant", ""),
                "amount": float(row.get("amount", 0)),
                "date": datetime.strptime(row.get("date", ""), "%Y-%m-%d"),
                "description": row.get("description", "")
            }

            # Categorize using AI
            category = categorize_func(expense_data)
            expense_data["category"] = category

            is_flagged, flag_reason, is_approved = check_expense_against_policies(expense_data, policies)
            expense_data["is_flagged"] = is_flagged
            expense_data["flag_reason"] = flag_reason
            expense_data["is_approved"] = not is_flagged if is_approved is None else is_approved

            db_expense = Expense(**expense_data)
            db.add(db_expense)

            stats["total_processed"] += 1

            if is_flagged:
                stats["flagged"] += 1
            else:
                stats["successful"] += 1

        except Exception as e:
            print(f"Error processing CSV row: {e}")
            # Optionally add error tracking to stats
            # stats["errors"] += 1
            continue

    db.commit()
    return stats

def check_expense_against_policies(expense_data, policies):
    is_flagged = False
    flag_reason = None
    is_approved = None

    for policy in policies:
        if policy.category != expense_data["category"]:
            continue

        rule_type = policy.rule_type
        rule_value = policy.rule_value

        if rule_type == "amount_max" and expense_data["amount"] > rule_value:
            is_flagged = True
            flag_reason = f"Amount exceeds maximum of {rule_value}"
            is_approved = False if policy.policy_type == "hard" else None

        elif rule_type == "merchant_blacklist" and expense_data["merchant"].lower() in [m.lower() for m in rule_value]:
            is_flagged = True
            flag_reason = f"Merchant is blacklisted"
            is_approved = False if policy.policy_type == "hard" else None

        # Add more rule types as needed

        if is_flagged and policy.policy_type == "hard":
            break

    return is_flagged, flag_reason, is_approved