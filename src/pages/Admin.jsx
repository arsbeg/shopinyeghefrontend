import React, { useState } from "react";
import UsersTab from "../components/admin/UsersTab";
import StoresTab from "../components/admin/StoresTab";
import CouriersTab from "../components/admin/CouriersTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1 rounded ${
              activeTab === "users" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            className={`px-3 py-1 rounded ${
              activeTab === "stores" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => setActiveTab("couriers")}
            className={`px-3 py-1 rounded ${
              activeTab === "couriers" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Couriers
          </button>
        </nav>
      </header>

      <main className="p-6">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "stores" && <StoresTab />}
        {activeTab === "couriers" && <CouriersTab />}
      </main>
    </div>
  );
}
