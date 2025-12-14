import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <div className="bg-sky-300 text-white text-[9px] md:text-[12px] lg:text-[14px] px-0 py-0 flex w-full border-t-[5px] border-sky-700 justify-between items-center shadow rounded-b-xl">
      <div className="flex items-center gap-6">       
        <nav className="flex gap-0 md:gap-3 lg:gap-4">
          <button
            onClick={() => onTabChange("users")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "users" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => onTabChange("stores")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "stores" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => onTabChange("carousel")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "carousel" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Carousel
          </button>
          <button
            onClick={() => onTabChange("city")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "city" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Cities
          </button>
          <button
            onClick={() => onTabChange("statistics")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "statistics" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => onTabChange("couriers")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "couriers" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Couriers
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "profile" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/*<div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-300">
            👤 {user.username} ({user.role || "admin"})
          </span>
        )}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>*/}
    </div>
  );
}