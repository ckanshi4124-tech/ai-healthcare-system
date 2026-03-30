# backend/app/recommendation/engine.py

def normalize(monitoring=None, lifestyle=None, advisory=None):
    return {
        "monitoring": monitoring or [],
        "lifestyle": lifestyle or [],
        "advisory": advisory or []
    }


# ML DISEASE RECOMMENDATIONS
def get_recommendation(disease, probability, risk_level=None):
    disease = disease.lower()

    # -----------------------------------------------------
    # CLINICAL OVERRIDE LAYER (HYBRID AI SAFETY)
    # -----------------------------------------------------
    if risk_level:
        risk_level = risk_level.upper()

        if risk_level == "HIGH":
            probability = max(probability, 0.9)

        elif risk_level == "MODERATE":
            probability = max(probability, 0.6)

        elif risk_level == "BORDERLINE":
            probability = max(probability, 0.45)

        elif risk_level == "LOW":
            probability = min(probability, 0.3)

    # -----------------------------------------------------
    # ANEMIA
    # -----------------------------------------------------
    if disease == "anemia":

        if probability >= 0.7:
            return normalize(
                monitoring=[
                    "Complete Blood Count (CBC) every 4–6 weeks",
                    "Serum Ferritin and Iron Profile testing",
                    "Vitamin B12 and Folate assessment"
                ],
                lifestyle=[
                    "Increase intake of iron-rich foods",
                    "Consume Vitamin C to enhance iron absorption",
                    "Ensure adequate protein intake"
                ],
                advisory=[
                    "Consult a hematologist",
                    "Strict adherence to supplementation therapy"
                ]
            )

        elif probability >= 0.4:
            return normalize(
                monitoring=["Repeat CBC in 3 months"],
                lifestyle=["Improve dietary iron intake"],
                advisory=["Moderate anemia risk"]
            )

        else:
            return normalize(
                monitoring=["Annual blood check-up"],
                lifestyle=["Maintain balanced diet"],
                advisory=["Low anemia risk"]
            )

    # -----------------------------------------------------
    # DIABETES
    # -----------------------------------------------------
    if disease == "diabetes":

        if probability >= 0.7:
            return normalize(
                monitoring=[
                    "HbA1c every 3 months",
                    "Fasting & Postprandial sugar monitoring",
                    "Annual retinal and kidney screening"
                ],
                lifestyle=[
                    "Strict carbohydrate control",
                    "Daily 30–45 min exercise",
                    "Weight management"
                ],
                advisory=[
                    "Consult endocrinologist",
                    "Medication or insulin therapy may be required"
                ]
            )

        elif probability >= 0.4:
            return normalize(
                monitoring=[
                    "HbA1c every 6 months",
                    "Monthly fasting glucose"
                ],
                lifestyle=[
                    "Adopt low glycemic index diet",
                    "Increase fiber intake",
                    "Regular exercise"
                ],
                advisory=[
                    "Moderate diabetes risk",
                    "Lifestyle intervention required"
                ]
            )

        else:
            return normalize(
                monitoring=["Annual glucose screening"],
                lifestyle=[
                    "Maintain healthy BMI",
                    "Avoid excessive sugar"
                ],
                advisory=[
                    "Low diabetes risk"
                ]
            )

    # -----------------------------------------------------
    # HEART
    # -----------------------------------------------------
    if disease == "heart":

        if probability >= 0.7:
            return normalize(
                monitoring=[
                    "ECG and Echocardiogram",
                    "Lipid profile every 6 months",
                    "Weekly blood pressure tracking"
                ],
                lifestyle=[
                    "Low-sodium diet",
                    "Avoid smoking",
                    "Supervised exercise"
                ],
                advisory=[
                    "Consult cardiologist urgently"
                ]
            )

        elif probability >= 0.4:
            return normalize(
                monitoring=["Annual lipid profile"],
                lifestyle=["Mediterranean diet", "Stress reduction"],
                advisory=["Moderate cardiac risk"]
            )

        else:
            return normalize(
                monitoring=["Routine annual screening"],
                lifestyle=["Maintain active lifestyle"],
                advisory=["Low cardiac risk"]
            )

    # -----------------------------------------------------
    # CKD
    # -----------------------------------------------------
    if disease == "ckd":

        if probability >= 0.7:
            return normalize(
                monitoring=[
                    "Serum Creatinine & eGFR monitoring",
                    "Urine Albumin testing"
                ],
                lifestyle=[
                    "Reduce sodium intake",
                    "Avoid nephrotoxic drugs"
                ],
                advisory=[
                    "Consult nephrologist",
                    "Strict follow-up required"
                ]
            )

        elif probability >= 0.4:
            return normalize(
                monitoring=["Creatinine monitoring every 6 months"],
                lifestyle=["Hydration maintenance"],
                advisory=["Early kidney dysfunction suspected"]
            )

        else:
            return normalize(
                monitoring=["Annual kidney screening"],
                lifestyle=["Balanced diet"],
                advisory=["Low CKD risk"]
            )

    return normalize(advisory=["Invalid disease type"])

# X-RAY PNEUMONIA RECOMMENDATIONS
def pneumonia_recommendations(label, confidence):

    label = label.upper()

    if label == "PNEUMONIA":

        if confidence >= 0.80:
            return normalize(
                monitoring=[
                    "Immediate clinical evaluation by physician",
                    "Pulse oximetry monitoring",
                    "Complete Blood Count (CBC)",
                    "CRP / inflammatory markers"
                ],
                lifestyle=[
                    "Strict bed rest",
                    "Adequate hydration",
                    "Avoid cold exposure"
                ],
                advisory=[
                    "High likelihood of pneumonia detected",
                    "Seek urgent medical attention"
                ]
            )

        elif confidence >= 0.50:
            return normalize(
                monitoring=[
                    "Clinical consultation recommended",
                    "Monitor fever and cough progression"
                ],
                lifestyle=[
                    "Adequate rest",
                    "Stay hydrated"
                ],
                advisory=[
                    "Moderate suspicion of pneumonia"
                ]
            )

        else:
            return normalize(
                monitoring=[
                    "Observe symptoms for 3–5 days"
                ],
                lifestyle=[
                    "Maintain immune-supportive diet"
                ],
                advisory=[
                    "Low confidence pneumonia detection"
                ]
            )

    else:
        return normalize(
            monitoring=[
                "No immediate imaging follow-up required"
            ],
            lifestyle=[
                "Maintain healthy respiratory habits"
            ],
            advisory=[
                "Chest X-ray appears normal"
            ]
        )