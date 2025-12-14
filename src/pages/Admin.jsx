import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import UsersTab from "../components/admin/UsersTab";
import StoresTab from "../components/admin/StoresTab";
import CarouselTab from "../components/admin/CarouselTab";
import CouriersTab from "../components/admin/CouriersTab";
import ProfileTab from "../components/admin/ProfileTab";
import CitiesTab from "../components/admin/CitiesTab";
import StatisticsTab from "../components/admin/StatisticsTab";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-100">
      <div><h1 className="font-bold">Admin Dashboard</h1></div>
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-2 ">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "stores" && <StoresTab />}
        {activeTab === "carousel" && <CarouselTab />}
        {activeTab === "city" && <CitiesTab />}
        {activeTab === "statistics" && <StatisticsTab />}
        {activeTab === "couriers" && <CouriersTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}
