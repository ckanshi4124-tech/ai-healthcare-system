# backend/app/api/predict_diabetes.py
from fastapi import APIRouter
import numpy as np
import pickle
import os

router = APIRouter()

# -----------------------------
# Load Model + Scaler
# -----------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
MODEL_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "diabetes_xgboost.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "diabetes_scaler.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except:
    model = None

try:
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
except:
    scaler = None


# --------------------------------
# FIXED ENDPOINT
# --------------------------------
@router.post("/predict-diabetes")
def predict_diabetes(data: dict):
    if model is None or scaler is None:
        return {"error": "Model or scaler missing"}

    required_keys = [
        "pregnancies", "glucose", "blood_pressure", "skin_thickness",
        "insulin", "bmi", "diabetes_pedigree", "age",
        "cholesterol", "hdl", "ldl", "triglycerides"
    ]

    values = []
    for k in required_keys:
        if k not in data:
            return {"error": f"Missing field: {k}"}
        try:
            values.append(float(data[k]))
        except:
            return {"error": f"Invalid numeric value for {k}"}

    arr = np.array(values).reshape(1, -1)

    scaled = scaler.transform(arr)
    pred = model.predict(scaled)[0]

    result = "diabetic" if int(pred) == 1 else "non-diabetic"

    return {
        "prediction": result,
        "raw_output": int(pred)
    }
