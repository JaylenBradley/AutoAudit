from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.core.database import Base, engine

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

# @app.on_event("startup")
# def on_startup():
#     Base.metadata.create_all(bind=engine)

@app.get("/")
async def read_root():
    return {"message": "AutoAudit API is running!"}