import React from "react";

export default function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 px-5 py-3 rounded-lg text-white shadow-lg z-50
      ${type === "error" ? "bg-red-500" : "bg-green-600"}`}>
      {message}
    </div>
  );
}
