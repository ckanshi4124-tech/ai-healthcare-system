import os
import pickle
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# -----------------------------
# FIXED PATHS (DO NOT MODIFY)
# -----------------------------
PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
MODEL_DIR = os.path.join(PROJECT_DIR, "ML", "models_saved")

MODEL_PATH = os.path.join(MODEL_DIR, "diabetes_xgboost.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "diabetes_scaler.pkl")

print("MODEL_PATH:", MODEL_PATH)
print("SCALER_PATH:", SCALER_PATH)

# -----------------------------
# Load model & scaler
# -----------------------------
if not os.path.exists(MODEL_PATH):
    raise HTTPException(status_code=500, detail=f"Model not found at {MODEL_PATH}")

if not os.path.exists(SCALER_PATH):
    raise HTTPException(status_code=500, detail=f"Scaler not found at {SCALER_PATH}")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(SCALER_PATH, "rb") as f:
    scaler = pickle.load(f)


# -----------------------------
# Input schema
# -----------------------------
class DiabetesInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float


# -----------------------------
# API Route
# -----------------------------
@router.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):

    try:
        df = pd.DataFrame([data.dict()])

        # ---- ADD THESE 4 FEATURE ENGINEERING LINES ---- #
        df["BMI_Squared"] = df["BMI"] ** 2
        df["Age_BMI"] = df["Age"] * df["BMI"]
        df["Insulin_Glucose_Ratio"] = df["Insulin"] / (df["Glucose"] + 1)
        df["SkinThickness_Age"] = df["SkinThickness"] * df["Age"]
        # ------------------------------------------------ #

        df_scaled = scaler.transform(df)

        prob = model.predict_proba(df_scaled)[0][1]
        prediction = int(prob >= 0.5)

        return {
            "prediction": prediction,
            "probability": float(prob),
            "message": "Diabetes detected" if prediction == 1 else "No diabetes detected"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
