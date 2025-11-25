import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", data);
      alert("User Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.detail || "Registration Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={registerUser}
        className="p-6 bg-white shadow-md rounded w-96 space-y-3"
      >
        <h2 className="text-xl font-bold">Create an Account</h2>

        <input
          name="full_name"
          className="border p-2 w-full"
          placeholder="Full Name"
          value={data.full_name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="border p-2 w-full"
          value={data.role}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Sign Up
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
