# backend/app/api/recommendation_api.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.recommendation.engine import (
    get_recommendation,
    pneumonia_recommendations,
)

router = APIRouter()


class RecInput(BaseModel):
    disease: str
    probability: float
    risk_level: str | None = None   # ← NEW FIELD


@router.post("/recommend")
def recommend(data: RecInput):
    if not 0 <= data.probability <= 1:
        raise HTTPException(status_code=400, detail="Invalid probability")

    return {
        "success": True,
        "recommendations": get_recommendation(
            data.disease,
            data.probability,
            data.risk_level,   # ← PASS RISK LEVEL
        ),
    }


@router.post("/recommend/xray")
def recommend_xray(data: dict):
    label = data.get("label")
    confidence = data.get("confidence")

    if not label or confidence is None:
        raise HTTPException(status_code=400, detail="Invalid X-ray data")

    return {
        "success": True,
        "recommendations": pneumonia_recommendations(label, confidence),
    }