import re

def smart_find(pattern, text):
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except:
            return match.group(1)
    return None


def apply_medical_rules(raw_text, extracted_values):
    """
    Improve missing or incorrect values using medical report patterns.
    """

    improved = extracted_values.copy()

    # Hemoglobin
    if "hemoglobin" not in improved or not improved["hemoglobin"]:
        val = smart_find(r"haemoglobin[\s:]+([0-9.]+)", raw_text)
        if val:
            improved["hemoglobin"] = val

    # WBC
    if "wbc" not in improved or not improved["wbc"]:
        val = smart_find(r"(total\s+leucocyte\s+count|wbc)[\s:]+([0-9.]+)", raw_text)
        if val:
            improved["wbc"] = val

    # Platelets
    if "platelets" not in improved or not improved["platelets"]:
        val = smart_find(r"platelet\s+count[\s:]+([0-9.]+)", raw_text)
        if val:
            improved["platelets"] = val

    # LDL
    if "ldl" not in improved:
        val = smart_find(r"ldl[\s:]+([0-9.]+)", raw_text)
        if val:
            improved["ldl"] = val

    # HDL
    if "hdl" not in improved:
        val = smart_find(r"hdl[\s:]+([0-9.]+)", raw_text)
        if val:
            improved["hdl"] = val

    return improved
