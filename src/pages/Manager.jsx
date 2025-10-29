import React, { useState } from "react";
import ManagerNavbar from "../components/ManagerNavbar";
import ProductsTab from "../components/manager/ProductsTab";
import StatisticsTab from "../components/manager/StatisticsTab";
import ProfileTab from "../components/manager/ProfileTab";

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100">
      <ManagerNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-6">
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "statistics" && <StatisticsTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}
