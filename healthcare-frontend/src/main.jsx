// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// ⭐ Global Frontend Error Listener (Task 4 — Step 3)
window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.error("[Frontend Error]", msg);
  return false; 
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>

      {/* Toasts globally */}
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
);
