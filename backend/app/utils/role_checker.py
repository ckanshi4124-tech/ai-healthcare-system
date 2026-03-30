from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.routes_auth import get_current_user
from backend.app.database.db_setup import SessionLocal

# DB Dependency (used internally)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ⛔ Deny Access if Not Correct Role
def allow_roles(allowed_roles: list):
    def role_checker(user=Depends(get_current_user)):
        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"❌ Access denied! Requires role: {allowed_roles}"
            )
        return user
    return role_checker
