import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">
        👩‍⚕️ Patient Dashboard
      </h1>

      <Link to="/upload-report" className="text-blue-700 underline text-lg">
        📄 Upload Medical Report
      </Link>

      <Link to="/symptoms" className="text-blue-700 underline text-lg">
        📝 Submit Symptoms
      </Link>
    </div>
  );
}
