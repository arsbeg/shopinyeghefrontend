import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
        <nav className="flex gap-4">
          <button
            onClick={() => onTabChange("users")}
            className={`px-3 py-1 rounded ${
              activeTab === "users" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => onTabChange("stores")}
            className={`px-3 py-1 rounded ${
              activeTab === "stores" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => onTabChange("couriers")}
            className={`px-3 py-1 rounded ${
              activeTab === "couriers" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Couriers
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-300">
            👤 {user.username} ({user.role || "admin"})
          </span>
        )}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}