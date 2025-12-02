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
      const response = await axios.post("http://127.0.0.1:8000/predict/heart", {
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

      setResult(response.data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ❤️ Heart Failure Prediction
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-semibold mb-1">{key}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="border p-2 rounded-md"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md mt-4"
          >
            {loading ? "Predicting..." : "Predict Heart Failure"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-600 font-semibold text-center mt-4">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
              Prediction Result
            </h3>

            <p className="text-center text-gray-700">
              <strong>Prediction:</strong>{" "}
              {result.prediction === 1 ? "High Risk" : "Low Risk"}
            </p>

            <p className="text-center text-gray-700">
              <strong>Probability:</strong>{" "}
              {(result.probability * 100).toFixed(2)}%
            </p>

            <p className="text-center text-gray-700 mt-1">
              <strong>Message:</strong> {result.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartPrediction;
