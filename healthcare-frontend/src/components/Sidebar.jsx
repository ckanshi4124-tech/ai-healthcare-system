// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BeakerIcon } from "@heroicons/react/24/solid";

function SidebarLink({ to, label }) {
  return (
    <Link
      to={to}
      className="block py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // ❌ Hide sidebar on login + signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  // ❌ Hide sidebar if not logged in
  if (!user) {
    return null;
  }

  return (
    <aside className="w-64 bg-indigo-900 text-white h-screen overflow-y-scroll p-5 pb-16 space-y-6">

      {/* Brand */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-wide">AI Health</h1>
        <p className="text-indigo-200 text-sm">
          Intelligent Healthcare Assistant
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2">
        <SidebarLink to="/dashboard" label="Dashboard" />
        <SidebarLink to="/upload-report" label="Upload Reports" />
        <SidebarLink to="/history" label="History" />
        <SidebarLink to="/profile" label="Profile" />
      </nav>

      {/* Disease Prediction Tools – ONLY for patients */}
      {user?.role === "patient" && (
        <div className="space-y-2 border-t border-indigo-700 pt-4">
          <p className="text-xs uppercase tracking-widest text-indigo-300 mb-1">
            AI Diagnosis Tools
          </p>

          <SidebarLink to="/anemia" label="Anemia Prediction" />
          <SidebarLink to="/diabetes" label="Diabetes Prediction" />
          <SidebarLink to="/heart" label="Heart Disease Prediction" />
          <SidebarLink to="/ckd" label="CKD Prediction" />

          <SidebarLink to="/xray-prediction" label="X-ray Analyzer" />
          <SidebarLink to="/ocr-report" label="OCR Analyzer" />

          <SidebarLink
            to="/recommendation"
            label="Recommendation Engine"
          />
        </div>
      )}
    </aside>
  );
}
