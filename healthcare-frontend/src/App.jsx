import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import UploadReport from "./pages/UploadReport";
import SymptomsForm from "./pages/SymptomsForm";
import History from "./pages/History";
import Profile from "./pages/Profile";

import AnemiaPrediction from "./pages/AnemiaPrediction";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import HeartPrediction from "./pages/HeartPrediction";
import CkdPrediction from "./pages/CkdPrediction";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/upload-report" element={<ProtectedRoute element={<UploadReport />} />} />
      <Route path="/symptoms" element={<ProtectedRoute element={<SymptomsForm />} />} />
      <Route path="/history" element={<ProtectedRoute element={<History />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

      {/* Disease Prediction Routes */}
      <Route
        path="/anemia-prediction"
        element={<ProtectedRoute element={<AnemiaPrediction />} />}
      />
      <Route
        path="/diabetes-prediction"
        element={<ProtectedRoute element={<DiabetesPrediction />} />}
      />
      <Route
        path="/heart-prediction"
        element={<ProtectedRoute element={<HeartPrediction />} />}
      />
      <Route
        path="/ckd-prediction"
        element={<ProtectedRoute element={<CkdPrediction />} />}
      />

      {/* Redirect Unmatched Routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
