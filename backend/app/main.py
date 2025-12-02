# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------
# FASTAPI APP
# ---------------------------
app = FastAPI(
    title="AI Healthcare Diagnostic System API",
    description="Backend Service – Authentication + Diagnostics",
    version="1.0.0"
)

# ---------------------------
# CORS (FULLY FIXED)
# ---------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# ROOT CHECK
# ---------------------------
@app.get("/")
def root():
    return {"message": "Backend OK"}

@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend alive"}

# ---------------------------
# IMPORT ROUTERS (100% FIXED)
# ---------------------------
from backend.app.api.routes_auth import router as auth_router
from backend.app.api.routes_patient import router as patient_router
from backend.app.api.predict_anemia import router as anemia_router
from backend.app.api.predict_diabetes import router as diabetes_router
from backend.app.api.predict_heart import router as heart_router
from backend.app.api.predict_ckd import router as ckd_router

# ---------------------------
# INCLUDE ROUTERS
# ---------------------------
app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(anemia_router)
app.include_router(diabetes_router)
app.include_router(heart_router)
app.include_router(ckd_router)
