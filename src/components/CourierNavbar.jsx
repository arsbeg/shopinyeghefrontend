import React from "react";
import { useAuth } from "../context/AuthContext";

export default function CourierNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-sky-200 text-[9px] md:text-[12px] lg:text-[14px] text-black px-6 py-1 flex justify-between rounded-full items-center shadow">
      <div className="flex items-center gap-6">
        <nav className="flex gap-4">
          <button
            onClick={() => onTabChange("orders")}
            className={`px-3 py-1 rounded-full border border-blue-500 cursor-pointer ${
              activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-blue-600"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1 rounded-full border border-blue-500 cursor-pointer ${
              activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-blue-600"
            }`}
          >
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
}