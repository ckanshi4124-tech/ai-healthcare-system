from fastapi import APIRouter
from pydantic import BaseModel
import pickle
import pandas as pd
import os

router = APIRouter()

# -------------------------
# Input Validation
# -------------------------
class AnemiaInput(BaseModel):
    Hemoglobin: float
    MCH: float
    MCHC: float
    MCV: float

# -------------------------
# Correct Path Resolution
# -------------------------

# Path to /ai-healthcare-system/
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))

MODEL_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "anemia_xgboost.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "ML", "models_saved", "anemia_scaler.pkl")

print("MODEL_PATH:", MODEL_PATH)
print("SCALER_PATH:", SCALER_PATH)

# -------------------------
# Load model and scaler
# -------------------------
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(SCALER_PATH, "rb") as f:
    scaler = pickle.load(f)

# -------------------------
# Prediction Route
# -------------------------
@router.post("/predict/anemia")
def predict_anemia(data: AnemiaInput):

    df = pd.DataFrame([data.dict()])

    scaled = scaler.transform(df)

    pred = model.predict(scaled)[0]
    prob = model.predict_proba(scaled)[0][1]

    return {
        "prediction": int(pred),
        "probability": float(prob),
        "message": "Anemia detected" if pred == 1 else "Normal Hemoglobin Levels"
    }
