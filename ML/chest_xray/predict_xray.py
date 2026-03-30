import tensorflow as tf
import numpy as np
import cv2
import os

MODEL_PATH = "models/cnn_pneumonia_model.keras"
IMG_SIZE = 180

# Load model
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img.astype("float32") / 255.0
    return np.expand_dims(img, axis=0)

def predict_xray(image_path):
    img = preprocess_image(image_path)
    prob = model.predict(img)[0][0]

    label = "PNEUMONIA" if prob > 0.5 else "NORMAL"
    confidence = prob if prob > 0.5 else 1 - prob

    return {
        "prediction": label,
        "confidence": float(confidence)
    }

if __name__ == "__main__":
    test_img = "dataset/test/NORMAL/IM-0001-0001.jpeg"   # change to any file you want
    result = predict_xray(test_img)
    print(result)
