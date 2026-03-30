import tensorflow as tf
import numpy as np
import cv2
import os

IMG_SIZE = 224   # standard for CNN models

def preprocess_image(image_path):
    """
    Preprocess a single image:
    - Read image
    - Resize to 224x224
    - Normalize to [0,1]
    - Ensure 3 channels (RGB)
    """

    img = cv2.imread(image_path)

    if img is None:
        print("Warning: Could not read", image_path)
        return None

    # Convert grayscale to RGB
    if len(img.shape) == 2 or img.shape[2] == 1:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)

    # Resize
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

    # Normalize
    img = img / 255.0

    return img
