# backend/tests/test_predict_heart.py

from fastapi.testclient import TestClient
from backend.app.main import app 

client = TestClient(app)

def test_predict_heart_ok():
    payload = {
        "Age": 60,
        "Anaemia": 0,
        "CPK": 250,
        "Diabetes": 1,
        "EjectionFraction": 35,
        "HighBP": 1,
        "Platelets": 250000,
        "SerumCreatinine": 1.2,
        "SerumSodium": 135,
        "Sex": 1,
        "Smoking": 0,
        "time": 4
    }

    resp = client.post("/predict/heart", json=payload)

    assert resp.status_code == 200, f"Got: {resp.status_code}, body: {resp.text}"
    body = resp.json()

    assert "prediction" in body
    assert "probability" in body
    assert 0.0 <= body["probability"] <= 1.0
