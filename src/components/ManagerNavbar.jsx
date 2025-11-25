import React from "react";
import { useAuth } from "../context/AuthContext";

export default function ManagerNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-800 text-[9px] md:text-[11] lg:text-[12] text-white px-6 py-3 flex justify-between rounded-xl items-center shadow">
      <div className="flex items-center gap-6">
        <nav className="flex gap-4">
          <button
            onClick={() => onTabChange("products")}
            className={`px-3 py-1 rounded-full border border-blue-500 cursor-pointer ${
              activeTab === "products" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onTabChange("orders")}
            className={`px-3 py-1 rounded-full border border-blue-500 cursor-pointer ${
              activeTab === "orders" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => onTabChange("statistics")}
            className={`px-3 py-1 rounded-full border border-blue-500 cursor-pointer ${
              activeTab === "statistics" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1 rounded-full border border-blue-500 cursor-pointer ${
              activeTab === "profile" ? "bg-blue-300" : "hover:bg-blue-600"
            }`}
          >
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
}