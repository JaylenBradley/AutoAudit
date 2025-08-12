from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv
from app.core import Base, engine
from app.api import expense_router, policy_router, user_router

load_dotenv()

if os.path.exists("/etc/secrets/firebase-adminsdk.json"):
    firebase_creds_path = "/etc/secrets/firebase-adminsdk.json"
else:
    firebase_creds_path = os.getenv("FIREBASE_CREDENTIALS")

cred = credentials.Certificate(firebase_creds_path)
firebase_admin.initialize_app(cred)

app = FastAPI(
    title="AutoAudit API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expense_router, prefix="/api", tags=["Expenses"])
app.include_router(policy_router, prefix="/api", tags=["Policies"])
app.include_router(user_router, prefix="/api", tags=["Users"])

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def read_root():
    return {"message": "AutoAudit API is running!"}