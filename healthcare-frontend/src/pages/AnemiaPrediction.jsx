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

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Prediction Request
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
    } catch (err) {
      setError("Something went wrong. Please check your input.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-8 shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Anemia Prediction
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter the required blood parameters to predict whether anemia is detected.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hemoglobin */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              name="Hemoglobin"
              value={formData.Hemoglobin}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* MCH */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              MCH (pg)
            </label>
            <input
              type="number"
              step="0.1"
              name="MCH"
              value={formData.MCH}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* MCHC */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              MCHC (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              name="MCHC"
              value={formData.MCHC}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* MCV */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              MCV (fL)
            </label>
            <input
              type="number"
              step="0.1"
              name="MCV"
              value={formData.MCV}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Predicting..." : "Predict Anemia"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 p-5 bg-gray-50 border rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Prediction Result:
            </h2>

            <p className="text-gray-700">
              <strong>Prediction:</strong>{" "}
              {result.prediction === 1 ? (
                <span className="text-red-600 font-bold">Anemia Detected</span>
              ) : (
                <span className="text-green-600 font-bold">
                  Normal Hemoglobin Levels
                </span>
              )}
            </p>

            <p className="text-gray-700 mt-2">
              <strong>Probability:</strong>{" "}
              {(result.probability * 100).toFixed(2)}%
            </p>

            <p className="text-gray-700 mt-2">
              <strong>Message:</strong> {result.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
