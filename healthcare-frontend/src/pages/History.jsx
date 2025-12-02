import { useEffect, useState } from "react";
import API from "../services/api";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/patient/history")
      .then(res => setData(res.data))
      .catch(() => alert("Error fetching history"));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📜 Medical History</h1>

      {data.length === 0 ? (
        <p className="text-gray-600">No records found</p>
      ) : (
        <div className="space-y-3">
          {data.map((record) => (
            <div key={record.id} className="bg-white shadow p-4 rounded border">
              <p><strong>🩺 Symptoms:</strong> {record.symptoms}</p>
              <p><strong>📝 Remarks:</strong> {record.remarks || "None"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
