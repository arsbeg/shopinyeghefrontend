import React, { useState } from "react";
import ManagerNavbar from "../components/ManagerNavbar";
import ProductsTab from "../components/manager/ProductsTab";
import StatisticsTab from "../components/manager/StatisticsTab";
import ProfileTab from "../components/manager/ProfileTab";
import OrdersTab from "../components/manager/OrdersTab";

export default function ManagerPage() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100">
      <div><h1 className="font-bold">Manager Dashboard</h1></div>
      <ManagerNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-2">
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "statistics" && <StatisticsTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}
