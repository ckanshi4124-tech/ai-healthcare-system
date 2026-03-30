import re

def extract_numeric_values(text: str):
    """
    Extracts ALL medical numeric values from OCR text,
    with support for CBC, lipid profile, KFT, LFT, thyroid, etc.
    """

    patterns = {
        "hemoglobin": r"(hemoglobin|hb)[^\d]*(\d+\.?\d*)",
        "wbc": r"(wbc|total leucocyte count)[^\d]*(\d+\.?\d*)",
        "platelets": r"(platelet|plt)[^\d]*(\d+\.?\d*)",

        # Lipid profile
        "total_cholesterol": r"(total cholesterol)[^\d]*(\d+\.?\d*)",
        "ldl": r"(ldl)[^\d]*(\d+\.?\d*)",
        "hdl": r"(hdl)[^\d]*(\d+\.?\d*)",
        "triglycerides": r"(triglycerides|tg)[^\d]*(\d+\.?\d*)",
        "vldl": r"(vldl)[^\d]*(\d+\.?\d*)",

        # KFT
        "creatinine": r"(creatinine)[^\d]*(\d+\.?\d*)",
        "urea": r"(urea)[^\d]*(\d+\.?\d*)",

        # LFT
        "sgpt": r"(sgpt|alt)[^\d]*(\d+\.?\d*)",
        "sgot": r"(sgot|ast)[^\d]*(\d+\.?\d*)",
        "bilirubin": r"(bilirubin)[^\d]*(\d+\.?\d*)",
    }

    extracted = {}

    lower = text.lower()

    for key, pattern in patterns.items():
        match = re.search(pattern, lower, re.IGNORECASE)
        if match:
            extracted[key] = float(match.group(2))

    return extracted
