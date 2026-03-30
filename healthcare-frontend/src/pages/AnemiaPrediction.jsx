import React, { useState } from "react";
import axios from "axios";

export default function AnemiaPrediction() {
  const [formData, setFormData] = useState({
    Hemoglobin: "",
    MCH: "",
    MCHC: "",
    MCV: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict/anemia", {
        Hemoglobin: parseFloat(formData.Hemoglobin),
        MCH: parseFloat(formData.MCH),
        MCHC: parseFloat(formData.MCHC),
        MCV: parseFloat(formData.MCV),
      });

      setResult(res.data);
      
      localStorage.setItem(
      "lastPrediction",
      JSON.stringify({
      disease: "anemia",
      probability: res.data.probability,
      risk_level: res.data.risk_level
      })
    );
    } catch (err) {
      setError("Something went wrong. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const isAnemia = result?.prediction === 1;

  // ✅ Normalize once, display everywhere
  const riskPercent =
    result?.probability !== undefined
      ? (result.probability * 100).toFixed(2)
      : null;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-2">
          Anemia Risk Assessment
        </h1>
        <p className="text-center text-gray-600 mb-8">
          AI-assisted evaluation based on hematological parameters
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Hemoglobin (g/dL)", name: "Hemoglobin" },
            { label: "MCH (pg)", name: "MCH" },
            { label: "MCHC (g/dL)", name: "MCHC" },
            { label: "MCV (fL)", name: "MCV" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type="number"
                step="0.1"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Predicting..." : "Predict Anemia"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Result Panel */}
        {result && (
          <div
            className={`mt-8 p-6 rounded-xl border-2 ${
              isAnemia
                ? "bg-red-50 border-red-600"
                : "bg-green-50 border-green-600"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-3 flex items-center gap-2 ${
                isAnemia ? "text-red-700" : "text-green-700"
              }`}
            >
              {isAnemia ? "⚠️ Anemia Detected" : "✅ No Anemia Detected"}
            </h2>

            <p className="text-gray-700 mb-3">
              <strong>Clinical Interpretation:</strong>{" "}
              {isAnemia
                ? "Findings suggest reduced red blood cell indices consistent with anemia."
                : "Hematological parameters are within normal reference range."}
            </p>

            <p className="text-sm text-gray-600 italic">
              This prediction is AI-assisted and should be validated with
              laboratory tests and consultation with a qualified medical
              professional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
