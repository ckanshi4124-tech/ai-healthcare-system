from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import os
from datetime import datetime
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.app.database.db_setup import SessionLocal
from backend.app.utils.role_checker import allow_roles
from backend.app.models.health import HealthRecord
from backend.app.models.medical_report import MedicalReport  # 👈 ADD THIS IMPORT!
from backend.app.services.auth_service import decode_access_token

router = APIRouter(prefix="/patient", tags=["Patient Actions"])

security = HTTPBearer()

# 📌 Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 📤 Upload Medical Report (Patients Only)
@router.post("/upload/report")
def upload_report(
    file: UploadFile = File(...),
    user=Depends(allow_roles(["patient", "admin"])),
    db: Session = Depends(get_db)
):
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]

    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF, JPG, PNG allowed!")

    upload_dir = "backend/app/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    # Secure & unique file name
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    extension = file.filename.split(".")[-1]
    safe_name = f"patient_{user['id']}_{timestamp}.{extension}"

    file_path = os.path.join(upload_dir, safe_name)

    # Save file securely
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # 📌 Save metadata in DB
    report = MedicalReport(
        patient_id=user["id"],
        file_name=safe_name,
        file_type=file.content_type,
    )

    db.add(report)
    db.commit()

    return {"message": "Report uploaded & stored securely!", "file": safe_name}


# 📝 Submit Symptoms (Patients Only)
@router.post("/symptoms")
def submit_symptoms(
    data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload["role"] != "patient":
        raise HTTPException(status_code=403, detail="Only patients can submit symptoms")

    new_record = HealthRecord(
        patient_id=payload["user_id"],
        symptoms=data.get("symptoms"),
        remarks=data.get("remarks", "")
    )

    db.add(new_record)
    db.commit()

    return {"message": "Symptoms saved successfully!"}


# 📜 Get Patient History
@router.get("/history")
def get_patient_history(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload["role"] != "patient":
        raise HTTPException(status_code=403, detail="Only patients can view history")

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
        ]
    }
