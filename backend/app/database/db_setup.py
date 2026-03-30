import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env from backend/app folder
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not found in .env")

# Engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False
)

# Session
SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
)

# Base model
Base = declarative_base()

def init_db():
    try:
        from backend.app.models import User, HealthRecord, MedicalReport
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
    except Exception as e:
        print("❌ Error while creating tables:", e)

init_db()
