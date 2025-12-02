# backend/app/api/predict_ckd.py

import os
import pickle
import numpy as np
from fastapi import APIRouter

router = APIRouter()

# ----------------------------------------------------
# Correct BASE directory
# ----------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
MODEL_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "ckd_xgboost.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "ckd_scaler.pkl")

# ----------------------------------------------------
# Load model & scaler once
# ----------------------------------------------------
model = None
scaler = None

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("[predict_ckd] CKD model loaded successfully.")
except Exception as e:
    print(f"[predict_ckd] ERROR loading CKD model: {e}")

try:
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    print("[predict_ckd] CKD scaler loaded successfully.")
except Exception as e:
    print(f"[predict_ckd] ERROR loading CKD scaler: {e}")


# ----------------------------------------------------
# CKD Prediction API Endpoint
# ----------------------------------------------------
@router.post("/predict-ckd")
def predict_ckd(data: dict):

    # Required order (same as training)
    keys = [
        "age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba",
        "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv",
        "wbcc", "rbcc", "htn", "dm", "cad", "appet", "pe", "ane"
    ]

    # safety check
    if model is None or scaler is None:
        return {"error": "CKD model or scaler not loaded on server."}

    # Validate & convert data
    values = []
    for k in keys:
        if k not in data:
            return {"error": f"Missing field: {k}"}

        try:
            values.append(float(data[k]))
        except:
            return {"error": f"Invalid numeric value for {k}: {data[k]}"}

    arr = np.array(values).reshape(1, -1)

    # Scale input
    scaled = scaler.transform(arr)

    # Predict
    pred = model.predict(scaled)[0]

    # Convert to readable output
    result = "ckd" if int(pred) == 1 else "notckd"

    return {
        "prediction": result,
        "raw_output": int(pred)
    }
