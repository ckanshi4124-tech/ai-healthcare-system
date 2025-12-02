import { useState } from "react";
import API from "../services/api";

export default function UploadReport() {
  const [file, setFile] = useState(null);

  const uploadReport = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/patient/upload/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded!");
    } catch (err) {
      alert(err?.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 space-y-4">
      <h2 className="text-xl font-bold text-blue-800">📤 Upload Report</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={uploadReport}
        className="bg-blue-700 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}
