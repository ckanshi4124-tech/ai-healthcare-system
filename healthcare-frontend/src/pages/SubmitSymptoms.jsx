import { useState } from "react";
import API from "../services/api";

export default function SubmitSymptoms() {
  const [symptoms, setSymptoms] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/patient/submit-symptoms", { symptoms });
      alert("Symptoms submitted successfully!");
    } catch (err) {
      alert(err?.response?.data?.detail || "Error submitting symptoms");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 space-y-4 p-6">
      <h1 className="text-3xl font-bold text-blue-700">
        📝 Submit Symptoms
      </h1>

      <textarea
        className="border p-3 w-96 h-40"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
