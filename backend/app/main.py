# backend/app/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
from logging.handlers import RotatingFileHandler
import os

# ===================================
# LOGGING CONFIG (already added)
# ===================================
LOG_DIR = "logs"
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

logger = logging.getLogger("healthcare_logger")
logger.setLevel(logging.INFO)

handler = RotatingFileHandler(
    f"{LOG_DIR}/app.log",
    maxBytes=5 * 1024 * 1024,
    backupCount=3,
    encoding="utf-8"
)

formatter = logging.Formatter("%(asctime)s — %(levelname)s — %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)


# ===================================
# FASTAPI APP
# ===================================
app = FastAPI(
    title="AI Healthcare Diagnostic System API",
    description="Backend Service | Authentication + Diagnostics",
    version="1.0.0",
    debug=False,        # security hardening
)

# ==========================================
# 🔹 ML MODEL LOADING (STARTUP)
# ==========================================

import joblib

MODELS = {}

@app.on_event("startup")
def load_ml_models():
    try:
        base_path = os.path.join(os.getcwd(), "ML", "models_saved")

        MODELS["anemia"] = {
            "model": joblib.load(os.path.join(base_path, "anemia_xgboost.pkl")),
            "scaler": joblib.load(os.path.join(base_path, "anemia_scaler.pkl")),
        }

        MODELS["heart"] = {
            "model": joblib.load(os.path.join(base_path, "heart_xgboost.pkl")),
            "scaler": joblib.load(os.path.join(base_path, "heart_scaler.pkl")),
        }

        MODELS["diabetes"] = {
            "model": joblib.load(os.path.join(base_path, "diabetes_xgboost.pkl")),
            "scaler": joblib.load(os.path.join(base_path, "diabetes_scaler.pkl")),
        }

        MODELS["ckd"] = {
            "model": joblib.load(os.path.join(base_path, "ckd_xgboost.pkl")),
            "scaler": joblib.load(os.path.join(base_path, "ckd_scaler.pkl")),
        }

        logger.info("✅ All ML models loaded successfully")
        print("✅ Loaded models:", list(MODELS.keys()))

    except Exception as e:
        logger.error(f"❌ Model loading failed: {e}")
        raise e

# ===================================
# CORS (ALREADY FIXED EARLIER)
# ===================================
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

# ======================================================
# 🟣 TASK 3 — MONITORING MIDDLEWARE (REQUEST TIMING)
# ======================================================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = round(time.time() - start_time, 3)

    logger.info(
        f"{request.method} {request.url.path} — {response.status_code} — {duration}s"
    )

    return response


# ===================================
# ROOT CHECK
# ===================================
@app.get("/")
def root():
    return {"message": "Backend OK"}

@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend alive"}


# ===================================
# IMPORT ROUTERS
# ===================================
from backend.app.api.routes_auth import router as auth_router
from backend.app.api.routes_patient import router as patient_router
from backend.app.api.predict_anemia import router as anemia_router
from backend.app.api.predict_diabetes import router as diabetes_router
from backend.app.api.predict_heart import router as heart_router
from backend.app.api.predict_ckd import router as ckd_router
from backend.app.api.report_ocr import router as ocr_router
from backend.app.api.predict_xray import router as xray_router
from backend.app.api.recommendation_api import router as rec_router


# ===================================
# INCLUDE ROUTERS
# ===================================
app.include_router(auth_router)
app.include_router(patient_router)
app.include_router(anemia_router)
app.include_router(diabetes_router)
app.include_router(heart_router)
app.include_router(ckd_router)
app.include_router(ocr_router)
app.include_router(xray_router)
app.include_router(rec_router)
