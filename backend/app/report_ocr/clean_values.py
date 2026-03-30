import re

def clean_number(x):
    """Convert extracted OCR number-like strings into clean floats."""
    if x is None:
        return None

    # Remove unwanted characters
    x = re.sub(r"[^0-9\.\-]", "", str(x))

    try:
        return float(x)
    except:
        return None


def clean_extracted_values(values: dict):
    """
    Clean & standardize numeric values extracted from OCR text.
    Input example:
        {"wbc": "6000", "hb": "13.3", "cholesterol": " 190 mg/dl "}
    Output:
        {"wbc": 6000, "hb": 13.3, "cholesterol": 190}
    """

    cleaned = {}

    for key, value in values.items():
        cleaned[key] = clean_number(value)

    return cleaned
