import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  HomeIcon,
  DocumentArrowUpIcon,
  HeartIcon,
  UserCircleIcon,
  ClockIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-indigo-900 text-white p-6 shadow-xl space-y-8">
        <h2 className="text-3xl font-bold tracking-wide">AI Health</h2>

        <div className="space-y-4 text-md font-medium">
          <SidebarLink to="/dashboard" icon={<HomeIcon className="h-5 w-5" />} label="Dashboard" />
          <SidebarLink to="/upload-report" icon={<DocumentArrowUpIcon className="h-5 w-5" />} label="Upload Reports" />
          <SidebarLink to="/symptoms" icon={<BeakerIcon className="h-5 w-5" />} label="AI Diagnosis" />
          <SidebarLink to="/history" icon={<ClockIcon className="h-5 w-5" />} label="History" />
          <SidebarLink to="/profile" icon={<UserCircleIcon className="h-5 w-5" />} label="Profile" />

          <div className="border-t border-gray-500 pt-4 mt-4 space-y-3">
            <SidebarLink to="/anemia-prediction" icon={<HeartIcon className="h-5 w-5" />} label="Anemia Prediction" />
            <SidebarLink to="/diabetes-prediction" icon={<HeartIcon className="h-5 w-5" />} label="Diabetes Prediction" />
            <SidebarLink to="/heart-prediction" icon={<HeartIcon className="h-5 w-5" />} label="Heart Disease Prediction" />
            <SidebarLink to="/ckd-prediction" icon={<HeartIcon className="h-5 w-5" />} label="CKD Prediction" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {profile?.full_name || user?.full_name || ""}
        </h1>

        <p className="text-xl mt-2 text-gray-600">
          Role: <span className="font-semibold">{profile?.role || user?.role || ""}</span>
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          
          <DashboardCard title="Upload Medical Report" link="/upload-report" />
          <DashboardCard title="AI Symptom Diagnosis" link="/symptoms" />
          <DashboardCard title="Your Reports History" link="/history" />
          <DashboardCard title="Anemia Prediction" link="/anemia-prediction" />
          <DashboardCard title="Diabetes Prediction" link="/diabetes-prediction" />
          <DashboardCard title="Heart Disease Prediction" link="/heart-prediction" />
          <DashboardCard title="CKD Prediction" link="/ckd-prediction" />
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
    >
      {icon}
      {label}
    </Link>
  );
}

function DashboardCard({ title, link }) {
  return (
    <Link
      to={link}
      className="p-6 bg-white shadow-md hover:shadow-xl rounded-xl border hover:border-indigo-600 transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </Link>
  );
}
