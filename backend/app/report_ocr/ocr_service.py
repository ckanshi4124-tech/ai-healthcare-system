import re
import pytesseract
from PIL import Image
import easyocr

# -----------------------------
#  Tesseract Path (if needed)
# -----------------------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# -----------------------------
#  Load EasyOCR Reader Once
# -----------------------------
reader = easyocr.Reader(['en'], gpu=False)

# =================================================================
#  METHOD 1 — TESSERACT BASIC OCR (NO CONFIDENCE SCORE)
# =================================================================
def extract_text_tesseract(image_path: str):
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
    except Exception as e:
        print("Tesseract error:", e)
        return "", None

    # Normalize / clean text early (Step 5)
    text = clean_text(text)

    return text, None


# =================================================================
#  METHOD 2 — EASYOCR WITH CONFIDENCE SCORES
# =================================================================
def extract_text_easyocr(image_path: str):
    """
    Returns:
        full_text: extracted text (string)
        avg_conf: average OCR confidence (0–1)
    """
    try:
        results = reader.readtext(image_path)

        text_list = []
        conf_list = []

        for (bbox, text, confidence) in results:
            text_list.append(text)
            conf_list.append(confidence)

        full_text = "\n".join(text_list)
        avg_conf = sum(conf_list) / len(conf_list) if conf_list else 0

        # -------------------------
        # Step 5 — Clean extracted text
        # -------------------------
        full_text = clean_text(full_text)

        return full_text, avg_conf

    except Exception as e:
        print("EasyOCR error:", e)
        return "", 0.0


# =================================================================
#  TEXT NORMALIZATION (STEP 5)
# =================================================================
def clean_text(text: str):
    if not text:
        return ""

    # Remove all non-ASCII / weird characters
    text = re.sub(r"[^\x00-\x7F]+", " ", text)

    # Collapse multiple spaces and newlines
    text = re.sub(r"\s+", " ", text)

    return text.strip()
