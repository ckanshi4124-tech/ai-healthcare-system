import React, { useState } from "react";

/**
 * DiabetesPrediction.jsx
 * Place in healthcare-frontend/src/pages/
 *
 * Expects backend endpoint POST /predict/diabetes
 * Body (JSON) keys:
 *  Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
 */

export default function DiabetesPrediction() {
  const [form, setForm] = useState({
    Pregnancies: 0,
    Glucose: 120,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 80,
    BMI: 25,
    DiabetesPedigreeFunction: 0.5,
    Age: 30,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { prediction, probability, message }
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    // numeric cast
    setForm((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    // Basic validation
    if (
      form.Glucose <= 0 ||
      form.BMI <= 0 ||
      form.Age <= 0 ||
      form.BloodPressure < 0
    ) {
      setError("Please enter valid positive numbers for Glucose, BMI and Age.");
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch("/predict/diabetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json();
      if (!resp.ok) {
        // backend returned error message
        const msg = data.detail || data.message || JSON.stringify(data);
        throw new Error(msg);
      }

      // success
      setResult({
        prediction: data.prediction,
        probability: Number(data.probability),
        message: data.message || (data.prediction === 1 ? "Diabetes detected" : "No diabetes detected"),
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "An unknown error occurred. Check backend logs.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      Pregnancies: 0,
      Glucose: 120,
      BloodPressure: 70,
      SkinThickness: 20,
      Insulin: 80,
      BMI: 25,
      DiabetesPedigreeFunction: 0.5,
      Age: 30,
    });
    setResult(null);
    setError("");
  }

  const probPercent = result ? Math.round(result.probability * 10000) / 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Diabetes Prediction</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white rounded-2xl shadow p-6 space-y-4"
        >
          <p className="text-sm text-gray-500">
            Enter the patient's numeric values. Values should be realistic lab/body
            measurements. The model returns a probability and a prediction.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-gray-600">Pregnancies</span>
              <input
                name="Pregnancies"
                value={form.Pregnancies}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Glucose (mg/dL)</span>
              <input
                name="Glucose"
                value={form.Glucose}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Blood Pressure (mm Hg)</span>
              <input
                name="BloodPressure"
                value={form.BloodPressure}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Skin Thickness (mm)</span>
              <input
                name="SkinThickness"
                value={form.SkinThickness}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Insulin (mu U/ml)</span>
              <input
                name="Insulin"
                value={form.Insulin}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">BMI</span>
              <input
                name="BMI"
                value={form.BMI}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Diabetes Pedigree Function</span>
              <input
                name="DiabetesPedigreeFunction"
                value={form.DiabetesPedigreeFunction}
                onChange={handleChange}
                type="number"
                min="0"
                step="0.001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Age</span>
              <input
                name="Age"
                value={form.Age}
                onChange={handleChange}
                type="number"
                min="0"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-200"
              />
            </label>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="space-x-2">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-indigo-200`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeOpacity="0.2"
                        strokeWidth="4"
                      />
                      <path
                        d="M22 12a10 10 0 00-10-10"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    Predicting...
                  </>
                ) : (
                  "Predict"
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            <div className="text-sm text-gray-500">Model: Diabetes (v1)</div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded">{error}</div>
          )}
        </form>

        {/* Right: Result Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-medium">Result</h2>

          {!result && (
            <div className="text-sm text-gray-500">
              No prediction yet. Fill form and click <strong>Predict</strong>.
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Prediction</div>
                  <div
                    className={`mt-1 font-semibold ${
                      result.prediction === 1 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {result.message}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">Probability</div>
                  <div className="mt-1 text-xl font-bold">{probPercent}%</div>
                </div>
              </div>

              {/* progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 ${
                    result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(Math.max(probPercent, 0), 100)}%` }}
                />
              </div>

              <div className="text-xs text-gray-500 mt-2">
                Model output (probability of diabetes). For clinical decisions,
                consult a healthcare professional.
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(JSON.stringify(result))}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
                >
                  Copy Result JSON
                </button>
              </div>
            </>
          )}

          <div className="mt-auto text-xs text-gray-400">
            Tip: Use the same measurement units used in lab reports (e.g. mg/dL for
            Glucose).
          </div>
        </div>
      </div>
    </div>
  );
}
