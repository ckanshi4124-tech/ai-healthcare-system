import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

import {
  HomeIcon,
  DocumentArrowUpIcon,
  BeakerIcon,
  ClockIcon,
  UserCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  // Fetch logged-in user profile
  useEffect(() => {
    const getProfile = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const res = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.log("Failed to fetch profile:", error);
      }
    };

    getProfile();
  }, []);

  const displayName = profile?.full_name || user?.full_name || "User";
  const displayRole = profile?.role || user?.role || "patient";

  return (
    <div className="space-y-8">
      {/* Top section */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <HomeIcon className="h-4 w-4" />
            Dashboard
          </p>

          <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {displayName}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Role:{" "}
            <span className="font-semibold capitalize text-indigo-700">
              {displayRole}
            </span>
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl">
            Use your AI-powered tools to analyze reports, predict disease risk,
            and receive smart health recommendations — all in one place.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/upload-report"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <DocumentArrowUpIcon className="h-4 w-4" />
            Upload Report
          </Link>

          <Link
            to="/history"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-700 transition"
          >
            <ClockIcon className="h-4 w-4" />
            View History
          </Link>
        </div>
      </section>

      {/* Highlight cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Upload Medical Reports"
          description="Analyze your lab reports or scans with ML models and OCR."
          to="/upload-report"
          Icon={DocumentArrowUpIcon}
        />
        <DashboardCard
          title="Personalized Recommendations"
          description="Get diet, tests, and doctor suggestions based on your risk."
          to="/recommendation"
          Icon={HeartIcon}
        />
      </section>

      {/* AI Diagnosis tools */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
          AI Diagnosis Tools
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Anemia Prediction"
            description="Predict anemia risk from numeric blood report values."
            to="/anemia"
            Icon={HeartIcon}
          />
          <DashboardCard
            title="Diabetes Prediction"
            description="Use lab metrics to estimate diabetes risk."
            to="/diabetes"
            Icon={HeartIcon}
          />
          <DashboardCard
            title="Heart Disease Prediction"
            description="ML model to classify heart disease risk category."
            to="/heart"
            Icon={HeartIcon}
          />
          <DashboardCard
            title="CKD Prediction"
            description="Classify chronic kidney disease risk from blood values."
            to="/ckd"
            Icon={HeartIcon}
          />
          <DashboardCard
            title="X-ray Analyzer"
            description="Upload chest X-ray images and get CNN-based findings."
            to="/xray-prediction"
            Icon={BeakerIcon}
          />
          <DashboardCard
            title="OCR Report Analyzer"
            description="Extract and structure values from PDF/image reports."
            to="/ocr-report"
            Icon={DocumentArrowUpIcon}
          />
        </div>
      </section>

      {/* Profile hint */}
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 flex items-center gap-3 text-sm text-slate-600">
        <UserCircleIcon className="h-6 w-6 text-slate-500" />
        <div>
          <p className="font-medium text-slate-800">
            Keep your profile information updated
          </p>
          <p className="text-xs text-slate-500">
            Visit your{" "}
            <Link
              to="/profile"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Profile
            </Link>{" "}
            page to manage personal details for better, personalized insights.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ===========================
   Reusable Dashboard Card
=========================== */

function DashboardCard({ title, description, to, Icon }) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
