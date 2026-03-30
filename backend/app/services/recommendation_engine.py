import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

# Load JSON guideline files
def load_json(file_name):
    file_path = BASE_DIR / "data" / "guidelines" / file_name
    with open(file_path, "r") as f:
        return json.load(f)

diet_data = load_json("diet_guidelines.json")
test_data = load_json("test_guidelines.json")
doctor_data = load_json("doctor_guidelines.json")
symptom_data = load_json("symptom_rules.json")
lifestyle_data = load_json("lifestyle.json")


# ---------------------------------------------------
# MAIN RECOMMENDATION ENGINE FUNCTION
# ---------------------------------------------------
def generate_recommendations(disease, probability, user_profile, symptoms=[]):
    """
    disease: "anemia" / "diabetes" / "heart" / "ckd" / "pneumonia"
    probability: float between 0–1
    user_profile: { age, gender }
    symptoms: list of user-entered symptoms
    """

    # -------------------------
    # 1. Determine severity
    # -------------------------
    if probability >= 0.75:
        severity = "high"
    elif probability >= 0.45:
        severity = "moderate"
    else:
        severity = "low"

    # -------------------------
    # 2. Pull recommendations
    # -------------------------
    diet = diet_data.get(disease, {}).get(severity, [])
    tests = test_data.get(disease, {}).get(severity, [])
    doctor = doctor_data.get(disease, {}).get(severity, "")
    lifestyle = lifestyle_data.get(disease, [])

    # -------------------------
    # 3. Symptom-based reinforcement
    # -------------------------
    symptom_matches = []
    for s in symptoms:
        if s in symptom_data:
            if disease in symptom_data[s]:
                symptom_matches.append(s)

    # Boost severity if many matching symptoms
    if len(symptom_matches) >= 2 and severity == "low":
        severity = "moderate"

    # -------------------------
    # 4. Personalization
    # -------------------------
    age = user_profile.get("age", 25)
    gender = user_profile.get("gender", "female")

    personal_notes = []

    if age > 50 and disease in ["heart", "diabetes", "ckd"]:
        personal_notes.append("Due to your age, follow-up testing is strongly recommended.")

    if gender == "female" and disease == "anemia":
        personal_notes.append("Women commonly experience anemia due to iron loss; maintain iron-rich diet.")

    if len(symptoms) > 0:
        personal_notes.append("Your symptoms were considered in generating this plan.")

    # -------------------------
    # 5. RETURN FINAL STRUCTURED RESULT
    # -------------------------
    return {
        "severity": severity,
        "diet_plan": diet,
        "recommended_tests": tests,
        "doctor_advice": doctor,
        "lifestyle": lifestyle,
        "symptom_matches": symptom_matches,
        "personalized_notes": personal_notes
    }
