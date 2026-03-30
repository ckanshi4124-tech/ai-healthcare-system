import React, { useState } from "react";
import axios from "axios";

const categoricalOptions = {
  RBC: ["normal", "abnormal"],
  PusCell: ["normal", "abnormal"],
  PusCellClumps: ["present", "notpresent"],
  Bacteria: ["present", "notpresent"],
  Hypertension: ["yes", "no"],
  DiabetesMellitus: ["yes", "no"],
  CoronaryArteryDisease: ["yes", "no"],
  Appetite: ["good", "poor"],
  PedalEdema: ["yes", "no"],
  Anemia: ["yes", "no"],
};

const CkdPrediction = () => {
  const [formData, setFormData] = useState({
    Age: "",
    BloodPressure: "",
    SpecificGravity: "",
    Albumin: "",
    Sugar: "",
    BloodGlucoseRandom: "",
    BloodUrea: "",
    SerumCreatinine: "",
    Sodium: "",
    Potassium: "",
    Hemoglobin: "",
    PCV: "",
    WBC: "",
    RBCC: "",
    RBC: "",
    PusCell: "",
    PusCellClumps: "",
    Bacteria: "",
    Hypertension: "",
    DiabetesMellitus: "",
    CoronaryArteryDisease: "",
    Appetite: "",
    PedalEdema: "",
    Anemia: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [
          k,
          isNaN(v) ? v : Number(v),
        ])
      );

      const res = await axios.post(
        "http://127.0.0.1:8000/predict/ckd",
        payload
      );

      setResult(res.data);
      localStorage.setItem(
      "lastPrediction",
      JSON.stringify({
      disease: "ckd",
      probability: res.data.probability,
      risk_level: res.data.risk_level
     })
    );

    } catch (err) {
      setError("Prediction failed. Please verify inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Chronic Kidney Disease Risk Assessment
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Early risk screening based on renal & biochemical parameters
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{key}</label>

              {categoricalOptions[key] ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select</option>
                  {categoricalOptions[key].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  step="any"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Analyzing..." : "Assess Risk"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}

              {result && (
        <div className={`mt-6 p-6 rounded-xl border ${
          result.risk_level === "High"
            ? "bg-red-50 border-red-500"
            : result.risk_level === "Moderate"
            ? "bg-yellow-50 border-yellow-500"
            : "bg-green-50 border-green-500"
        }`}>
          <h2 className="text-xl font-bold mb-2">
            {result.risk_level} CKD Risk
          </h2>

          <p className="mb-2">
            <strong>Confidence:</strong>{" "}
            {(result.probability * 100).toFixed(1)}%
          </p>

          <p className="text-sm text-gray-600">
            This prediction is AI-assisted and must be confirmed by a nephrologist.
          </p>
        </div>
      )}

    </div>  
  </div>     
);
}

export default CkdPrediction;