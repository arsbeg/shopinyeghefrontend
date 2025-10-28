import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import UsersTab from "../components/admin/UsersTab";
import StoresTab from "../components/admin/StoresTab";
import CarouselTab from "../components/admin/CarouselTab";
import CouriersTab from "../components/admin/CouriersTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-6">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "stores" && <StoresTab />}
        {activeTab === "carousel" && <CarouselTab />}
        {activeTab === "couriers" && <CouriersTab />}
      </main>
    </div>
  );
}
