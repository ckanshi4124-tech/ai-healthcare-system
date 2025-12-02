import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🧠 Load user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const loginUser = (data) => {
    // Save token
    localStorage.setItem("token", data.access_token);
    // Save user separately
    localStorage.setItem("user", JSON.stringify(data.user));
    // Update state
    setUser(data.user);
  };

  const logoutUser = () => {
    localStorage.clear(); // Clear everything (token + user)
    setUser(null);
    window.location.href = "/"; // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
