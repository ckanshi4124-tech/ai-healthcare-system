import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5 space-y-6">
      <h1 className="text-2xl font-bold">AI Health</h1>

      <nav className="space-y-4">
        <Link to="/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>

        {/* 📤 Upload Reports (All Patients) */}
        {user?.role === "patient" && (
          <Link to="/upload-report" className="block hover:text-gray-300">
            Upload Reports
          </Link>
        )}

        {/* 🧠 Submit Symptoms (AI Diagnosis) */}
        {user?.role === "patient" && (
          <Link to="/symptoms" className="block hover:text-gray-300">
            AI Diagnosis
          </Link>
        )}

        {/* 📜 History for All Users */}
        <Link to="/history" className="block hover:text-gray-300">
          History
        </Link>

        {/* 👤 Profile for All Users */}
        <Link to="/profile" className="block hover:text-gray-300">
          Profile
        </Link>
      </nav>
    </div>
  );
}
