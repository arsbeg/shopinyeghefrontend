import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function StatNavBar({ activeTab, onTabChange }) {
  // const { user, logout } = useAuth();

  return (
    <div className="bg-sky-300 text-white text-[9px] md:text-[12px] lg:text-[14px] px-0 py-0 flex w-full border-t-[5px] border-sky-700 justify-between items-center shadow rounded-b-xl">
      <div className="flex items-center gap-6">       
        <nav className="flex gap-0 md:gap-3 lg:gap-4">
          <button
            onClick={() => onTabChange("bytotalincome")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "bytotalincome" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            By Total Income
          </button>
          <button
            onClick={() => onTabChange("advancedstatistics")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "advancedstatistics" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Advanced Statistics
          </button>
          {/*<button
            onClick={() => onTabChange("tab2")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "tab2" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Tab2
          </button>
          <button
            onClick={() => onTabChange("tab3")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "tab3" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Tab3
          </button>
          <button
            onClick={() => onTabChange("tab4")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "tab4" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Tab4
          </button>
          <button
            onClick={() => onTabChange("tab5")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "tab5" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Tab5
          </button>
          <button
            onClick={() => onTabChange("tab6")}
            className={`px-3 py-1 rounded-b-xl ${
              activeTab === "tab6" ? "bg-sky-700" : "hover:bg-sky-500 cursor-pointer"
            }`}
          >
            Tab6
          </button>*/}
        </nav>
      </div>
    </div>
  );
}