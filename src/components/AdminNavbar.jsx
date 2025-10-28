import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center shadow rounded-xl">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
        <nav className="flex gap-4">
          <button
            onClick={() => onTabChange("users")}
            className={`px-3 py-1 rounded-full ${
              activeTab === "users" ? "bg-blue-600" : "hover:bg-blue-600 cursor-pointer"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => onTabChange("stores")}
            className={`px-3 py-1 rounded-full ${
              activeTab === "stores" ? "bg-blue-600" : "hover:bg-blue-600 cursor-pointer"
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => onTabChange("carousel")}
            className={`px-3 py-1 rounded-full ${
              activeTab === "carousel" ? "bg-blue-600" : "hover:bg-blue-600 cursor-pointer"
            }`}
          >
            Carousel
          </button>
          <button
            onClick={() => onTabChange("couriers")}
            className={`px-3 py-1 rounded-full ${
              activeTab === "couriers" ? "bg-blue-600" : "hover:bg-blue-600 cursor-pointer"
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
        {/*<button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full text-sm cursor-pointer"
        >
          Logout
        </button>*/}
      </div>
    </header>
  );
}