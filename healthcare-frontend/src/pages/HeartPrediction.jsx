import React, { useState } from "react";
import axios from "axios";

const HeartPrediction = () => {
  const [formData, setFormData] = useState({
    Age: "",
    Anaemia: "",
    CPK: "",
    Diabetes: "",
    EjectionFraction: "",
    HighBP: "",
    Platelets: "",
    SerumCreatinine: "",
    SerumSodium: "",
    Sex: "",
    Smoking: "",
    time: "",
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
      const res = await axios.post("http://127.0.0.1:8000/predict/heart", {
        Age: Number(formData.Age),
        Anaemia: Number(formData.Anaemia),
        CPK: Number(formData.CPK),
        Diabetes: Number(formData.Diabetes),
        EjectionFraction: Number(formData.EjectionFraction),
        HighBP: Number(formData.HighBP),
        Platelets: Number(formData.Platelets),
        SerumCreatinine: Number(formData.SerumCreatinine),
        SerumSodium: Number(formData.SerumSodium),
        Sex: Number(formData.Sex),
        Smoking: Number(formData.Smoking),
        time: Number(formData.time),
      });

      setResult(res.data);
      localStorage.setItem(
      "lastPrediction",
      JSON.stringify({
      disease: "heart",
      probability: res.data.probability,
      risk_level: res.data.risk_level
     })
   );
    } catch {
      setError("Something went wrong. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const isHighRisk = result?.prediction === 1;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
           Heart Failure Risk Assessment
        </h2>
        <p className="text-center text-gray-600 mb-8">
          AI-assisted evaluation based on clinical and cardiac parameters
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{key}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Analyzing..." : "Predict Heart Risk"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}

        {result && (
          <div
            className={`mt-8 p-6 rounded-xl border-2 ${
              isHighRisk
                ? "bg-red-50 border-red-600"
                : "bg-green-50 border-green-600"
            }`}
          >
            <h3
              className={`text-2xl font-semibold flex items-center gap-2 mb-3 ${
                isHighRisk ? "text-red-700" : "text-green-700"
              }`}
            >
              {isHighRisk ? "⚠️ High Heart Failure Risk" : "✅ Low Heart Failure Risk"}
            </h3>

            <p className="text-gray-800 mb-2">
              <strong>Clinical Interpretation:</strong>{" "}
              {isHighRisk
                ? "Model indicates a high likelihood of heart failure. Immediate medical consultation is advised."
                : "Model suggests low risk based on the provided clinical parameters."}
            </p>

            <p className="text-sm text-gray-600 italic mt-3">
              This prediction is AI-assisted and must be confirmed by a qualified
              cardiologist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartPrediction;
