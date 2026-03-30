from fastapi import APIRouter, HTTPException
import numpy as np
import pickle
import os

router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
MODEL_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "diabetes_xgboost.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "diabetes_scaler.pkl")

# Load model
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


FEATURE_ORDER = [
    "pregnancies",
    "glucose",
    "blood_pressure",
    "skin_thickness",
    "insulin",
    "bmi",
    "diabetes_pedigree",
    "age",
    "cholesterol",
    "triglycerides",
    "hdl",
    "ldl"
]


@router.post("/predict-diabetes")
def predict_diabetes(data: dict):

    # -----------------------------
    # Extract inputs
    # -----------------------------
    glucose = float(data["glucose"])
    bmi = float(data["bmi"])
    age = int(data["age"])
    pedigree = float(data["diabetes_pedigree"])
    insulin = float(data["insulin"])

    # -----------------------------
    # CLINICAL RULE ENGINE (PRIMARY)
    # -----------------------------
    if glucose >= 200:
        risk_level = "HIGH"
        diagnosis = "diabetic"
    elif glucose >= 126:
        risk_level = "MODERATE"
        diagnosis = "diabetic"
    elif glucose >= 100:
        risk_level = "BORDERLINE"
        diagnosis = "pre-diabetic"
    else:
        risk_level = "LOW"
        diagnosis = "non-diabetic"

    # Genetic + insulin override
    if glucose >= 140 and pedigree >= 0.7:
        risk_level = "HIGH"
        diagnosis = "diabetic"

    # -----------------------------
    # ML Probability (SECONDARY)
    # -----------------------------
    probability = 0.0

    if model and scaler:
        values = [float(data[f]) for f in FEATURE_ORDER]
        X = np.array(values).reshape(1, -1)
        X_scaled = scaler.transform(X)
        probability = float(model.predict_proba(X_scaled)[0][1])
    else:
        probability = 0.0

    # Clamp between 0 and 1
    probability = round(min(max(probability, 0.01), 0.99), 4)
        
    # -----------------------------
    # Message
    # -----------------------------
    messages = {
        "HIGH": "High risk of diabetes detected. Immediate medical consultation is strongly advised.",
        "MODERATE": "Moderate diabetes risk detected. Further tests like HbA1c are recommended.",
        "BORDERLINE": "Borderline glucose levels detected. Lifestyle modification is advised.",
        "LOW": "No diabetes detected. Maintain a healthy lifestyle."
    }

    return {
        "prediction": diagnosis,
        "risk_level": risk_level,
        "probability": probability,
        "message": messages[risk_level]
    }
