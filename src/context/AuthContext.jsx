import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode"; // <-- ADD THIS

const AuthContext = createContext(null);

// Helper to check expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);


  // Load user on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const token = localStorage.getItem("token");
    if (!token) return;

    // If token is expired → logout immediately
    if (isTokenExpired(token)) {
      logout();
      return;
    }

    // Decode and set auto logout timer
    const decoded = jwtDecode(token);
    const msUntilExpiry = decoded.exp * 1000 - Date.now();

    const timer = setTimeout(() => {
      logout();
    }, msUntilExpiry);

    setLogoutTimer(timer);

    return () => clearTimeout(timer);
  }, []);

  // Login
  const login = (userData, token) => {
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
    setUser(userData || null);

    // Reset auto logout timer when logging in
    if (logoutTimer) clearTimeout(logoutTimer);

    if (token) {
      const decoded = jwtDecode(token);
      const msUntilExpiry = decoded.exp * 1000 - Date.now();

      const timer = setTimeout(() => {
        logout();
      }, msUntilExpiry);

      setLogoutTimer(timer);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post(
          "/Users/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (err) {
      console.warn("Logout request failed (maybe token expired)", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (logoutTimer) clearTimeout(logoutTimer);

      setUser(null);

      window.location.href = "/shopinyeghefrontend/"; // your base path
    }
  };

  const token = localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
