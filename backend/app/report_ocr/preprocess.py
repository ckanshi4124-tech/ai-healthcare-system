import cv2
import os

def preprocess_image(image_path: str):
    img = cv2.imread(image_path)

    # If image cannot be read
    if img is None:
        return image_path

    # Step 1: grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Step 2: increase contrast
    alpha = 1.8      # contrast multiplier
    beta = -20       # brightness shift
    contrast = cv2.convertScaleAbs(gray, alpha=alpha, beta=beta)

    # Step 3: thresholding (binarization)
    _, thresh = cv2.threshold(contrast, 160, 255, cv2.THRESH_BINARY)

    # Step 4: Resize for better OCR reading
    resized = cv2.resize(thresh, None, fx=1.6, fy=1.6, interpolation=cv2.INTER_LINEAR)

    # Step 5: Correct cleaned file name safely
    base, ext = os.path.splitext(image_path)
    cleaned_path = f"{base}_clean.jpg"     # Always save processed image as JPG

    cv2.imwrite(cleaned_path, resized)

    return cleaned_path
