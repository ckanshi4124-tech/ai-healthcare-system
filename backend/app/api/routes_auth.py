# backend/app/api/routes_auth.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from backend.app.api.schemas import UserCreate, UserLogin
from backend.app.database.db_setup import SessionLocal
from backend.app.models.user import User
from backend.app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# --------------------------------------------------
# LOGGER
# --------------------------------------------------
logger = logging.getLogger("auth")

# --------------------------------------------------
# ROUTER
# --------------------------------------------------
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

# --------------------------------------------------
# DATABASE DEPENDENCY
# --------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==================================================
# REGISTER USER (JSON)
# ==================================================
@router.post("/register")
def register_user(request: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt: {request.email}")

    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=request.full_name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=request.role or "patient"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"success": True, "message": "User registered successfully"}

# ==================================================
# LOGIN USER (JSON — THIS FIXES 422)
# ==================================================
@router.post("/login")
def login_user(request: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt: {request.email}")

    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }

# ==================================================
# GET CURRENT USER (JWT)
# ==================================================
@router.get("/me")
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(credentials.credentials)

    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }
