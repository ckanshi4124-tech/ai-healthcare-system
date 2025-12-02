from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, HTTPAuthorizationCredentials, HTTPBearer

from backend.app.api.schemas import UserCreate
from backend.app.database.db_setup import SessionLocal
from backend.app.models.user import User
from backend.app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# 🔐 Bearer token for secure routes
security = HTTPBearer()

# 🗄 Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📝 REGISTER USER
@router.post("/register")
def register_user(request: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(request.password)

    new_user = User(
        full_name=request.full_name,
        email=request.email,
        hashed_password=hashed_pwd,
        role=request.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# 🔏 LOGIN USER
@router.post("/login")
def login_user(
    request: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    user = db.query(User).filter(User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Credentials")

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect Password")

    # 🎫 Create JWT token
    token = create_access_token(
        {"user_id": user.id, "email": user.email, "role": user.role}
    )

    # 🧾 Return final formatted response
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        },
        "message": "Login successful"
    }

# 🔒 PROTECTED ROUTE - Get Current User
@router.get("/me")
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload = decode_access_token(token)

    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
    }

# 🛡 Role-protected routes
from backend.app.utils.role_checker import allow_roles

@router.get("/doctor/dashboard")
def doctor_dashboard(user=Depends(allow_roles(["doctor", "admin"]))):
    return {"message": "Welcome Doctor!", "user": user}

@router.get("/patient/dashboard")
def patient_dashboard(user=Depends(allow_roles(["patient", "admin"]))):
    return {"message": "Welcome Patient!", "user": user}

@router.get("/admin/dashboard")
def admin_dashboard(user=Depends(allow_roles(["admin"]))):
    return {"message": "Welcome Admin!", "user": user}

@router.get("/profile")
def get_profile(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = decode_access_token(token)
    user = db.query(User).filter(User.id == payload["user_id"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }
