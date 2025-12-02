// healthcare-frontend/src/pages/DiabetesPrediction.jsx
import React, { useState } from "react";

export default function DiabetesPrediction() {
  const [form, setForm] = useState({
    pregnancies: 0,
    glucose: 120,
    blood_pressure: 70,
    skin_thickness: 20,
    insulin: 80,
    bmi: 25,
    diabetes_pedigree: 0.5,
    age: 30,
    cholesterol: 180,
    hdl: 45,
    ldl: 110,
    triglycerides: 150,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // FIXED URL — THIS IS THE ONLY CORRECT ONE
      const resp = await fetch("http://127.0.0.1:8000/predict-diabetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        throw new Error(`Server responded ${resp.status}`);
      }

      const data = await resp.json();

      if (data.error) throw new Error(data.error);

      setResult({
        prediction: data.prediction,
        raw_output: data.raw_output,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      pregnancies: 0,
      glucose: 120,
      blood_pressure: 70,
      skin_thickness: 20,
      insulin: 80,
      bmi: 25,
      diabetes_pedigree: 0.5,
      age: 30,
      cholesterol: 180,
      hdl: 45,
      ldl: 110,
      triglycerides: 150,
    });
    setResult(null);
    setError("");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Diabetes Prediction</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT FORM */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white p-6 rounded-xl shadow space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(form).map((key) => (
              <label key={key} className="block">
                <span className="text-xs text-gray-600 capitalize">
                  {key.replace("_", " ")}
                </span>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-2"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="ml-2 px-3 py-2 border rounded"
          >
            Reset
          </button>

          {error && (
            <div className="mt-3 p-3 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}
        </form>

        {/* RESULT PANEL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Result</h2>

          {!result && (
            <p className="text-gray-500 text-sm mt-2">
              No prediction yet.
            </p>
          )}

          {result && (
            <>
              <p className="text-xl font-bold mt-2">
                {result.prediction === "diabetic" ? (
                  <span className="text-red-600">Diabetic</span>
                ) : (
                  <span className="text-green-600">Non-Diabetic</span>
                )}
              </p>

              <p className="text-sm mt-2">
                Raw Output: <strong>{result.raw_output}</strong>
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
