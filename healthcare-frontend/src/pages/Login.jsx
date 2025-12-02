import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        "/auth/login",
        new URLSearchParams({
          username: form.email, // FastAPI requires "username" field
          password: form.password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // Save user + token to context/localStorage
      loginUser(response.data);

      // 🚀 Redirect to Unified Dashboard
      navigate("/dashboard");

    } catch (err) {
      alert(err?.response?.data?.detail || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow-md rounded w-96 space-y-3"
      >
        <h2 className="text-xl font-bold">Login</h2>

        <input
          name="email"
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
