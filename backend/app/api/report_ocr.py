# backend/app/api/report_ocr.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import os

from backend.app.report_ocr.ocr_service import extract_text_easyocr
from backend.app.report_ocr.ocr_backup import extract_text_tesseract
from backend.app.report_ocr.extract_values import extract_numeric_values
from backend.app.report_ocr.clean_values import clean_extracted_values
from backend.app.report_ocr.rules import apply_medical_rules
from backend.app.report_ocr.schema import build_structured_report
from backend.app.report_ocr.preprocess import preprocess_image
from backend.app.report_ocr.pdf_to_images import pdf_to_images

from PIL import Image

# Import logger
from backend.app.main import logger

router = APIRouter()

UPLOAD_FOLDER = "ocr_uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MAX_IMAGE_SIZE = (1600, 1600)   # ⭐ KEY SPEED FIX


def resize_image(image_path: str) -> str:
    """
    Resize image BEFORE OCR to reduce processing time.
    """
    try:
        img = Image.open(image_path)
        img.thumbnail(MAX_IMAGE_SIZE)
        resized_path = image_path.replace(".", "_resized.")
        img.save(resized_path)
        return resized_path
    except Exception as e:
        logger.warning(f"[OCR Resize Failed] {e}")
        return image_path


@router.post("/ocr/extract")
async def ocr_extract(file: UploadFile = File(...)):

    logger.info(f"[OCR Upload] Received file: {file.filename}, type={file.content_type}")

    # ---- Allowed MIME Types ----
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PNG, JPG, JPEG, PDF allowed.",
        )

    # ---- Max Size 10MB ----
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Max file size: 10 MB",
        )

    try:
        # -----------------------------------------------------
        # Save uploaded file
        # -----------------------------------------------------
        filename = file.filename or "report_upload"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        logger.info(f"[OCR Store] File saved to {file_path}")

        # -----------------------------------------------------
        # PDF → Convert ONLY FIRST PAGE
        # -----------------------------------------------------
        if filename.lower().endswith(".pdf"):
            logger.info("[OCR PDF] Converting first page only")
            image_paths = pdf_to_images(file_path, max_pages=1)

            if not image_paths:
                return {
                    "success": False,
                    "error": "PDF conversion failed.",
                    "confidence": 0,
                }

            file_path = image_paths[0]

        # -----------------------------------------------------
        # Resize image (BIG SPEED BOOST)
        # -----------------------------------------------------
        file_path = resize_image(file_path)

        # -----------------------------------------------------
        # OCR — EasyOCR (Primary)
        # -----------------------------------------------------
        logger.info("[OCR] Running EasyOCR")
        text, confidence = extract_text_easyocr(file_path)

        # -----------------------------------------------------
        # Weak OCR → Preprocess ONCE
        # -----------------------------------------------------
        if len(text.strip()) < 30:
            logger.warning("[OCR] Weak text → preprocessing once")
            processed = preprocess_image(file_path)
            text, confidence = extract_text_easyocr(processed)

        # -----------------------------------------------------
        # Backup OCR — ONLY if still weak
        # -----------------------------------------------------
        if len(text.strip()) < 30:
            logger.warning("[OCR] Switching to Tesseract backup")
            t_text, t_conf = extract_text_tesseract(file_path)
            if len(t_text.strip()) > len(text.strip()):
                text = t_text
                confidence = t_conf

        # -----------------------------------------------------
        # Final failure check
        # -----------------------------------------------------
        if len(text.strip()) < 30:
            return {
                "success": False,
                "error": "Could not extract readable text.",
                "confidence": confidence,
            }

        # -----------------------------------------------------
        # Extract & clean values
        # -----------------------------------------------------
        raw_vals = extract_numeric_values(text)
        cleaned_vals = clean_extracted_values(raw_vals)
        final_vals = apply_medical_rules(text, cleaned_vals)

        # -----------------------------------------------------
        # Build structured report
        # -----------------------------------------------------
        structured = build_structured_report(text, final_vals)

        logger.info("[OCR Completed] Successfully processed report")

        return {
            "success": True,
            "confidence": confidence,
            "report": structured,
        }

    except Exception as e:
        logger.error(f"[OCR Error] {e}")
        return {
            "success": False,
            "error": "Unexpected error occurred.",
            "confidence": 0,
        }