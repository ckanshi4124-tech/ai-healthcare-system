# backend/app/api/predict_heart.py

import pickle
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# ------------------------------
# Load model + scaler
# ------------------------------

MODEL_PATH = "ML/models_saved/heart_xgboost.pkl"
SCALER_PATH = "ML/models_saved/heart_scaler.pkl"

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)

    # 🔥 PRINT STORAGE PATHS (you forgot this earlier)
    print("MODEL PATH:", MODEL_PATH)
    print("SCALER PATH:", SCALER_PATH)

except Exception as e:
    raise HTTPException(status_code=500, detail=f"Model loading error: {e}")


# ------------------------------
# Input Schema
# ------------------------------

class HeartInput(BaseModel):
    Age: float
    Anaemia: int
    CPK: float
    Diabetes: int
    EjectionFraction: float
    HighBP: int
    Platelets: float
    SerumCreatinine: float
    SerumSodium: float
    Sex: int
    Smoking: int
    time: int


# ------------------------------
# API Router
# ------------------------------

router = APIRouter()

@router.post("/predict/heart")
def predict_heart(data: HeartInput):

    try:
        # Must match model training order ***
        feature_order = [
            "Age",
            "Anaemia",
            "CPK",
            "Diabetes",
            "EjectionFraction",
            "HighBP",
            "Platelets",
            "SerumCreatinine",
            "SerumSodium",
            "Sex",
            "Smoking",
            "time"
        ]

        # Convert input to DataFrame
        df = pd.DataFrame([data.dict()])[feature_order]

        # Scale
        df_scaled = scaler.transform(df)

        # Predict
        prob = model.predict_proba(df_scaled)[0][1]
        prediction = int(prob >= 0.5)

        return {
            "prediction": prediction,
            "probability": float(prob),
            "message": "High risk of heart failure" if prediction == 1 else "Low risk"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
