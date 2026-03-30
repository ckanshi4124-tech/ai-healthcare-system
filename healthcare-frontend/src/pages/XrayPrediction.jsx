import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const XrayPrediction = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please upload a chest X-ray image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict-xray",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const resultData = {
          label: response.data.label,          // NORMAL | PNEUMONIA
          confidence: response.data.confidence // number
        };

        setResult(resultData);

        // ✅ persist for Recommendation page refresh safety
        localStorage.setItem(
          "lastPrediction",
          JSON.stringify({
            type: "xray",
            ...resultData,
          })
        );
      } else {
        alert("Prediction failed. Please try again.");
      }
    } catch (error) {
      console.error("X-ray prediction error:", error);
      alert("X-ray analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerWrapper}>
          <h2 style={styles.mainTitle}>Chest X-ray Pneumonia Analysis</h2>
          <p style={styles.subTitle}>
            AI-assisted evaluation of chest radiographs for pneumonia detection
          </p>
          <div style={styles.divider}></div>
        </div>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <img src={preview} alt="X-ray Preview" style={styles.image} />
        )}

        <button
          onClick={handlePredict}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Analyzing..." : "Analyze X-ray"}
        </button>
      </div>

      {/* ✅ Result panel */}
      {result && (
        <div className="bg-green-100 p-4 rounded mt-6">
          <h3 className="font-semibold">
            Result: {result.label}
          </h3>
          <p>
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </p>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() =>
              navigate("/recommendation", {
                state: {
                  type: "xray",
                  label: result.label,
                  confidence: result.confidence,
                },
              })
            }
          >
            View Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 900,
    margin: "auto",
    padding: 30,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  headerWrapper: {
    textAlign: "center",
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "#1e88e5",
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: "#1e88e5",
    margin: "0 auto",
    borderRadius: 2,
  },
  image: {
    width: "100%",
    maxWidth: 520,
    maxHeight: 420,
    objectFit: "contain",
    display: "block",
    margin: "20px auto",
    borderRadius: 8,
    border: "1px solid #ddd",
    backgroundColor: "#000",
  },
  button: {
    marginTop: 20,
    padding: "10px 25px",
    fontSize: 16,
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default XrayPrediction;