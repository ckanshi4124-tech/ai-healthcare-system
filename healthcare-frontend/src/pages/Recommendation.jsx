import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Recommendation() {
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load last prediction automatically
  useEffect(() => {
    const stored = localStorage.getItem("lastPrediction");

    if (!stored) {
      setError("No recent prediction found. Please run a disease analysis first.");
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(stored);
    setSummary(parsed);
    setLoading(false);
  }, []);

  // Fetch recommendations
  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://127.0.0.1:8000/recommend",
        {
          disease: summary.disease,
          probability: summary.probability,
          risk_level: summary.risk_level   // 🔥 NOW WE SEND IT
        }
      );

      setRecommendations(res.data.recommendations);

    } catch (err) {
      console.error(err);
      setError("Failed to generate recommendations.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Clinical Recommendation Report
      </h1>

      {summary && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">
            Last Prediction Summary
          </h2>

          <p className="mb-2">
            <strong>Disease:</strong> {summary.disease}
          </p>

          <p className="mb-2">
            <strong>Clinical Risk Level:</strong> {summary.risk_level}
          </p>

          <p className="mb-4">
            <strong>ML Probability:</strong>{" "}
            {(summary.probability * 100).toFixed(2)}%
          </p>

          <button
            onClick={fetchRecommendation}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Recommendation
          </button>
        </div>
      )}

      {recommendations && (
        <>
          {recommendations.monitoring?.length > 0 && (
            <Section title="Medical Monitoring" items={recommendations.monitoring} />
          )}

          {recommendations.lifestyle?.length > 0 && (
            <Section title="Lifestyle & Nutrition" items={recommendations.lifestyle} />
          )}

          {recommendations.advisory?.length > 0 && (
            <Section title="Clinical Advisory" items={recommendations.advisory} />
          )}
        </>
      )}

      <p className="text-sm text-gray-500 mt-8">
        ⚠ This AI-generated report does not replace professional medical advice.
      </p>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ul className="list-disc pl-5 space-y-2">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}