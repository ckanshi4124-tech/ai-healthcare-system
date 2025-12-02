import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return element;
}
