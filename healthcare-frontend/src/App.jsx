import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import History from "./pages/History";
import UploadReport from "./pages/UploadReport";
import AnemiaPrediction from "./pages/AnemiaPrediction";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import CkdPrediction from "./pages/CkdPrediction";
import HeartPrediction from "./pages/HeartPrediction";
import XrayPrediction from "./pages/XrayPrediction";
import OcrReport from "./pages/OcrReport";
import Recommendation from "./pages/Recommendation";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("[Route]", location.pathname);
  }, [location]);

  // ⛔ CRITICAL: wait until auth finishes
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      {user && <Sidebar />}

      <main className={`flex-1 p-4 overflow-y-auto ${user ? "" : "w-full"}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Any logged-in user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Patient + Admin */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload-report"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <UploadReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/anemia"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <AnemiaPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/diabetes"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <DiabetesPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ckd"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <CkdPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/heart"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <HeartPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/xray-prediction"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <XrayPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ocr-report"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <OcrReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recommendation"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <Recommendation />
              </ProtectedRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor", "admin"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ SAFE fallback */}
          <Route
            path="*"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}
