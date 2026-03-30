from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime
import os
import logging

# ✅ RELATIVE IMPORTS (THIS FIXES YOUR ERROR)
from ..database.db_setup import SessionLocal
from ..models.medical_report import MedicalReport
from ..models.health import HealthRecord
from ..services.auth_service import decode_access_token

logger = logging.getLogger("patient")

router = APIRouter(prefix="/patient", tags=["Patient Actions"])
security = HTTPBearer()


# ============================================================
# DB DEPENDENCY
# ============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# UPLOAD MEDICAL REPORT
# ============================================================
@router.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(credentials.credentials)

    if payload["role"] not in ["patient", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")

    allowed_types = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")

    upload_dir = "backend/app/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    _, ext = os.path.splitext(file.filename)
    safe_name = f"patient_{payload['user_id']}_{timestamp}{ext}"
    file_path = os.path.join(upload_dir, safe_name)

    with open(file_path, "wb") as f:
        f.write(contents)

    report = MedicalReport(
        patient_id=payload["user_id"],
        file_name=safe_name,
        file_type=file.content_type,
    )

    db.add(report)
    db.commit()

    return {"message": "Report uploaded successfully", "file": safe_name}


# ============================================================
# GET PATIENT HISTORY
# ============================================================
@router.get("/history")
def get_patient_history(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(credentials.credentials)

    if payload["role"] != "patient":
        raise HTTPException(status_code=403, detail="Access denied")

    symptoms = db.query(HealthRecord).filter(
        HealthRecord.patient_id == payload["user_id"]
    ).all()

    reports = db.query(MedicalReport).filter(
        MedicalReport.patient_id == payload["user_id"]
    ).all()

    return {
        "symptoms": [
            {"id": s.id, "symptoms": s.symptoms, "remarks": s.remarks}
            for s in symptoms
        ],
        "reports": [
            {"id": r.id, "file": r.file_name, "type": r.file_type}
            for r in reports
        ],
    }
