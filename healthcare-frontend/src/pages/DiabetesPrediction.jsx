import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function DiabetesPrediction() {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    blood_pressure: "",
    skin_thickness: "",
    insulin: "",
    bmi: "",
    diabetes_pedigree: "",
    age: "",
    cholesterol: "",
    triglycerides: "",
    hdl: "",
    ldl: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW (global prediction storage)
  const { setLastPrediction } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-diabetes",
        formData
      );

      setResult(response.data);
      localStorage.setItem(
      "lastPrediction",
      JSON.stringify({
      disease: "diabetes",
      probability: response.data.probability,
      risk_level: response.data.risk_level
     })
   );

    } catch (error) {
      alert("Prediction failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const isDiabetic = result?.prediction === "diabetic";

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Diabetes Risk Assessment
        </h2>
        <p className="text-center text-gray-500 mt-2">
          AI-assisted evaluation based on metabolic and clinical parameters
        </p>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["pregnancies", "Pregnancies"],
            ["glucose", "Glucose (mg/dL)"],
            ["blood_pressure", "Blood Pressure (mmHg)"],
            ["skin_thickness", "Skin Thickness (mm)"],
            ["insulin", "Insulin (µU/mL)"],
            ["bmi", "BMI"],
            ["diabetes_pedigree", "Diabetes Pedigree Function"],
            ["age", "Age"],
            ["cholesterol", "Cholesterol (mg/dL)"],
            ["triglycerides", "Triglycerides (mg/dL)"],
            ["hdl", "HDL (mg/dL)"],
            ["ldl", "LDL (mg/dL)"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="number"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-md bg-blue-50 border border-gray-200 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Predicting..." : "Predict Diabetes"}
        </button>

        {result && (
          <div
            className={`mt-6 p-5 rounded-lg border ${
              isDiabetic
                ? "bg-red-50 border-red-500"
                : "bg-green-50 border-green-500"
            }`}
          >
            <h3
              className={`font-bold text-lg ${
                isDiabetic ? "text-red-600" : "text-green-600"
              }`}
            >
              {isDiabetic ? "Diabetes Detected" : "No Diabetes Detected"}
            </h3>

            <p className="mt-1 text-gray-700 italic">
              {isDiabetic
                ? "Elevated diabetes risk detected. Medical consultation and confirmatory tests (FPG, HbA1c) are advised."
                : "Low diabetes risk detected. Maintain healthy lifestyle and routine monitoring."}
            </p>

            <p className="text-sm text-gray-500 italic mt-3">
              This prediction is AI-assisted and should be validated with
              laboratory tests and consultation with a qualified healthcare
              professional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
