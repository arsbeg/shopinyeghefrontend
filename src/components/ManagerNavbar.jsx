import React from "react";
import { useAuth } from "../context/AuthContext";

export default function ManagerNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold">Manager Dashboard</h1>
        <nav className="flex gap-4">
          <button
            onClick={() => onTabChange("products")}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              activeTab === "products" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onTabChange("statistics")}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              activeTab === "statistics" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1 rounded-full cursor-pointer ${
              activeTab === "profile" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-300 cursor-pointer">
            👤 {user.username} ({user.role || "admin"})
          </span>
        )}
        {/*<button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>*/}
      </div>
    </header>
  );
}