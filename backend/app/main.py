from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv
from app.core.database import Base, engine

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

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def read_root():
    return {"message": "AutoAudit API is running!"}