import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">👤 My Account</h1>

      <div className="bg-white shadow-md p-6 rounded w-96 border">
        <p className="text-lg">
          <strong>👨‍⚕️ Name:</strong> {user?.full_name}
        </p>

        <p className="text-lg mt-2">
          <strong>📧 Email:</strong> {user?.email}
        </p>

        <p className="text-lg mt-2">
          <strong>🎭 Role:</strong> {user?.role}
        </p>

        <button
          onClick={logoutUser}
          className="bg-red-600 mt-6 text-white w-full py-2 rounded"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
