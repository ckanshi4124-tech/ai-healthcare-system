import { useState } from "react";
import API from "../services/api";

export default function SymptomsForm() {
  const [form, setForm] = useState({ symptoms: "", remarks: "" });

  const submitSymptoms = async () => {
    try {
      const response = await API.post("/patient/symptoms", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert(response.data.message);
    } catch (err) {
      alert(err?.response?.data?.detail || "Error submitting symptoms");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-6 shadow-lg rounded w-96 space-y-3">
        <h2 className="text-xl font-bold">📝 Health Symptoms</h2>

        <textarea
          className="border p-2 w-full"
          placeholder="Describe your symptoms..."
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
        ></textarea>

        <input
          className="border p-2 w-full"
          placeholder="Remarks (optional)"
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        <button
          onClick={submitSymptoms}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
