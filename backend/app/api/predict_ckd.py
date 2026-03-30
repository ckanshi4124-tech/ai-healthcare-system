from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import joblib

router = APIRouter()

model = joblib.load("ML/models_saved/ckd_xgboost.pkl")
scaler = joblib.load("ML/models_saved/ckd_scaler.pkl")

class CKDInput(BaseModel):
    Age: float
    BloodPressure: float
    SpecificGravity: float
    Albumin: float
    Sugar: float
    BloodGlucoseRandom: float
    BloodUrea: float
    SerumCreatinine: float
    Sodium: float
    Potassium: float
    Hemoglobin: float
    PCV: float
    WBC: float
    RBCC: float

    RBC: str
    PusCell: str
    PusCellClumps: str
    Bacteria: str
    Hypertension: str
    DiabetesMellitus: str
    CoronaryArteryDisease: str
    Appetite: str
    PedalEdema: str
    Anemia: str


def enc_abnormal(v):
    return 1 if v.lower() == "abnormal" else 0

def enc_present(v):
    return 1 if v.lower() == "present" else 0

def enc_yes(v):
    return 1 if v.lower() == "yes" else 0

def enc_appetite(v):   # ✅ CORRECT
    return 1 if v.lower() == "poor" else 0


@router.post("/predict/ckd")
def predict_ckd(data: CKDInput):

    features = np.array([[
        data.Age,
        data.BloodPressure,
        data.SpecificGravity,
        data.Albumin,
        data.Sugar,

        enc_abnormal(data.RBC),
        enc_abnormal(data.PusCell),
        enc_present(data.PusCellClumps),
        enc_present(data.Bacteria),

        data.BloodGlucoseRandom,
        data.BloodUrea,
        data.SerumCreatinine,
        data.Sodium,
        data.Potassium,
        data.Hemoglobin,
        data.PCV,
        data.WBC,
        data.RBCC,

        enc_yes(data.Hypertension),
        enc_yes(data.DiabetesMellitus),
        enc_yes(data.CoronaryArteryDisease),
        enc_appetite(data.Appetite),
        enc_yes(data.PedalEdema),
        enc_yes(data.Anemia),
    ]])

    features_scaled = scaler.transform(features)

    prob = float(model.predict_proba(features_scaled)[0][1])

    if prob < 0.3:
        risk = "Low"
    elif prob < 0.6:
        risk = "Moderate"
    else:
        risk = "High"

    return {
        "prediction": int(prob >= 0.5),
        "probability": round(prob, 3),
        "risk_level": risk
    }