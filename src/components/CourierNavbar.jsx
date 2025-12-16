import React from "react";
import { useAuth } from "../context/AuthContext";

export default function CourierNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-b from-sky-300 via-sky-100 to-sky-300 text-[9px] md:text-[12px] lg:text-[14px] text-black px-0 py-0 flex justify-between rounded-t-md items-center">
      <div className="flex items-center gap-4">
        <nav className="flex gap-0">
          <button
            onClick={() => onTabChange("orders")}
            className={`px-3 py-1 rounded-t-md cursor-pointer ${
              activeTab === "orders" ? "bg-gradient-to-b from-gray-400 via-white to-gray-200" : "hover:bg-blue-600"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1 rounded-t-md cursor-pointer ${
              activeTab === "profile" ? "bg-gradient-to-b from-gray-400 via-white to-gray-200" : "hover:bg-blue-600"
            }`}
          >
            Profile
          </button>
        </nav>
      </div>
    </header>
  );
}