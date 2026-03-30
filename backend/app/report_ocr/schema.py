import re

# =================================================================
#  DETECT REPORT TYPE
# =================================================================
def detect_report_type(text):
    t = text.lower()

    if "cbc" in t or "blood count" in t:
        return "CBC"

    if "lipid" in t or "cholesterol" in t:
        return "Lipid Profile"

    if "creatinine" in t or "urea" in t or "kidney" in t:
        return "Kidney Function Test"

    if "sgpt" in t or "liver" in t:
        return "Liver Function Test"

    return "Unknown"



# =================================================================
#  EXTRACT METADATA (NAME / AGE / GENDER)
#  Step-5 additions → Safe fallback to N/A
# =================================================================
def extract_metadata(text):
    meta = {}

    name = re.search(r"(Name|Patient Name)[:\s]+([A-Za-z ]+)", text)
    age = re.search(r"Age[:\s]+(\d+)", text)
    gender = re.search(r"(Male|Female|M|F)", text, re.IGNORECASE)

    meta["name"] = name.group(2).strip() if name else "N/A"
    meta["age"] = int(age.group(1)) if age else "N/A"
    meta["gender"] = gender.group(1) if gender else "N/A"

    return meta



# =================================================================
#  OPTIONAL RECOMMENDATIONS
# =================================================================
def add_recommendations(report):
    rec = []

    if report["report_type"] == "CBC":
        hb = report["values"].get("hb")
        if hb is not None and hb < 12:
            rec.append("Possible anemia — consider iron testing.")

    report["recommendations"] = rec
    return report



# =================================================================
#  FINAL STRUCTURED REPORT BUILDER
# =================================================================
def build_structured_report(text, extracted_values):
    report = {
        "report_type": detect_report_type(text),
        "metadata": extract_metadata(text),
        "values": extracted_values,
        "recommendations": []
    }

    return add_recommendations(report)
