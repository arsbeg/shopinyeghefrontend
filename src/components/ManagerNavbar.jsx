import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslate } from "../utils/useTranslate";

export default function ManagerNavbar({ activeTab, onTabChange }) {
  const { user, logout } = useAuth();
  const t = useTranslate()

  return (
    <header className="bg-gradient-to-b from-sky-300 via-sky-100 to-sky-300 text-[9px] md:text-[12px] lg:text-[14px] text-black px-0 py-0 flex justify-between rounded-t-lg items-center">
      <div className="flex items-center gap-6">
        <nav className="flex gap-0">
          <button
            onClick={() => onTabChange("products")}
            className={`px-3 py-1 rounded-t-lg cursor-pointer ${
              activeTab === "products" ? "bg-gradient-to-b from-gray-300 via-white to-gray-300" : "hover:bg-gray-100"
            }`}
          >
            {t("products")}
          </button>
          <button
            onClick={() => onTabChange("orders")}
            className={`px-3 py-1 rounded-t-lg cursor-pointer ${
              activeTab === "orders" ? "bg-gradient-to-b from-gray-300 via-white to-gray-300" : "hover:bg-gray-100"
            }`}
          >
            {t("orders")}
          </button>
          <button
            onClick={() => onTabChange("statistics")}
            className={`px-3 py-1 rounded-t-lg cursor-pointer ${
              activeTab === "statistics" ? "bg-gradient-to-b from-gray-300 via-white to-gray-300" : "hover:bg-gray-100"
            }`}
          >
            {t("statistics")}
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`px-3 py-1 rounded-t-lg cursor-pointer ${
              activeTab === "profile" ? "bg-gradient-to-b from-gray-300 via-white to-gray-300" : "hover:bg-gray-100"
            }`}
          >
            {t("profile")}
          </button>
        </nav>
      </div>
    </header>

    
  );
}