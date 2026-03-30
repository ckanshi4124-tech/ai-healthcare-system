from fastapi import APIRouter, UploadFile, File, HTTPException
import tensorflow as tf
import numpy as np
import cv2
import uuid
import os
from pathlib import Path

router = APIRouter(prefix="/api", tags=["X-ray"])

IMG_SIZE = 224

# ==============================
# LOAD PRETRAINED MODEL
# ==============================
model = tf.keras.applications.MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

classifier = tf.keras.Sequential([
    model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(1, activation="sigmoid")
])

# ==============================
# PREPROCESS
# ==============================
def preprocess_image(path):
    img = cv2.imread(path)
    if img is None:
        raise ValueError("Invalid image")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img.astype("float32") / 255.0
    return np.expand_dims(img, axis=0)

# ==============================
# ENDPOINT
# ==============================
@router.post("/predict-xray")
async def predict_xray(file: UploadFile = File(...)):

    if file.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only image files allowed")

    os.makedirs("temp_xray", exist_ok=True)
    file_path = f"temp_xray/{uuid.uuid4()}.jpg"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        img = preprocess_image(file_path)
        THRESHOLD = 0.75
        prob = float(classifier.predict(img)[0][0])

        if 0.65 <= prob < THRESHOLD:
          print(f"⚠️ Borderline case detected: {prob}")

        if prob >= THRESHOLD:
          label = "PNEUMONIA"
          confidence = prob
        else:
          label = "NORMAL"
          confidence = 1 - prob

        return {
            "success": True,
            "label": label,
            "confidence": round(confidence, 4)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)