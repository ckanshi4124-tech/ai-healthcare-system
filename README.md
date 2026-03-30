# 🏥 AI Healthcare Diagnostic System

An end-to-end **AI-powered healthcare platform** that analyzes medical data, predicts diseases, processes reports, and generates clinical recommendations using **Machine Learning, Deep Learning, and Computer Vision**.

---

## 🚀 Key Features

### 🧠 Disease Prediction (ML Models)
- Diabetes Prediction  
- Anemia Detection  
- Heart Disease Risk Prediction  
- Chronic Kidney Disease (CKD) Prediction  

👉 Outputs:
- Risk Level: **Low / Moderate / High**
- Probability Score
- Clinical Message

---

### 🩻 Medical Image Analysis (Deep Learning)
- X-ray image analysis using **CNN-based models**
- Supports automated disease detection from medical images

---

### 📄 OCR-based Report Analysis
- Extracts data from medical reports (PDF/Image)
- Uses OCR for structured data extraction

---

### 🤖 AI Recommendation Engine
- Generates personalized medical suggestions
- Suggests:
  - Lifestyle changes
  - Further tests
  - Clinical actions

---

## 🧠 Machine Learning & Deep Learning

- Classification Models: Logistic Regression, Random Forest, XGBoost  
- Deep Learning: CNN (for X-ray analysis)  
- Feature Engineering & Data Preprocessing  
- Probability-based Risk Scoring System  

---

## 🏗️ Tech Stack

| Layer        | Technologies |
|-------------|-------------|
| Backend     | FastAPI, Python |
| ML/DL       | Scikit-learn, TensorFlow / PyTorch |
| Frontend    | React.js, Tailwind CSS |
| Data        | Pandas, NumPy |
| CV & OCR    | OpenCV, Tesseract OCR |
| Database    | MongoDB |
| Deployment  | Docker (planned) |

---

## 📂 Project Structure
ai-healthcare-system/
│
├── backend/
│ ├── app/
│ ├── models/
│ ├── api/
│
├── frontend/
│ ├── src/
│
├── ML/
│ ├── notebooks/
│ ├── models_saved/
│
├── README.md
├── .gitignore


---
## 📸 Screenshots

### Dashboard
![Dashboard](assets/dashboard-ui.png)

### Diabetes Prediction
![Diabetes](assets/diabetes-form.png)

### Xray Pneumonia prediction
![Xray](assets/xray-result.png)
## ⚙️ How to Run

### 🔹 Backend

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

### 🔹 frontend
cd healthcare-frontend
npm install
npm run dev

---

### System Workflow

User Input → Data Preprocessing → ML/DL Model → Prediction → Risk Level → Recommendation Engine → Output

📌 Current Status
✅ Core ML models implemented
✅ Frontend + Backend integration
⚠️ Minor UI/logic improvements ongoing
🚀 Continuous improvements in progress

---

### ⚠️ Disclaimer

This project is built for educational and research purposes only.
It should NOT be used as a substitute for professional medical advice.

--- 

### 👩‍💻 Author

Chitranshi Kulshrestha
AI/ML Enthusiast 