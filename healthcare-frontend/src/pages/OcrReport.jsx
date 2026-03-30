import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OcrReport() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJSON, setShowJSON] = useState(false);

  const navigate = useNavigate();

  const icons = {
    CBC: "🩸",
    "Kidney Function Test": "🧪",
    "Lipid Profile": "💧",
    Unknown: "📄",
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/ocr/extract",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);

      // ✅ persist for safety
      localStorage.setItem(
        "lastPrediction",
        JSON.stringify({
          type: "ocr",
          report_type: res.data.report.report_type,
          values: res.data.report.values,
        })
      );
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600">
          Medical Report OCR Analysis
        </h2>
        <p className="text-gray-600 mt-1">
          AI-assisted extraction and interpretation of medical test reports
        </p>
        <div className="w-20 h-1 bg-blue-500 mx-auto mt-3 rounded" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="ml-4 px-6 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Processing..." : "Upload Report"}
        </button>
      </div>

      {result && result.success && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            {icons[result.report.report_type] || "📄"}{" "}
            {result.report.report_type}
          </h3>

          {/* ✅ VIEW RECOMMENDATION BUTTON */}
          <button
            className="mb-6 px-5 py-2 bg-green-600 text-white rounded"
            onClick={() =>
              navigate("/recommendation", {
                state: {
                  type: "ocr",
                  report_type: result.report.report_type, // ✅ FIXED
                  values: result.report.values,
                },
              })
            }
          >
            View Recommendations
          </button>

          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
            {JSON.stringify(result.report, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}