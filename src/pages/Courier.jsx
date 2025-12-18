import React, { useState } from "react";
import ProfileTab from "../components/courier/ProfileTab";
import OrdersTab from "../components/courier/OrdersTab";
import CourierNavbar from "../components/CourierNavbar";
import { useTranslate } from "../utils/useTranslate";

export default function CourierPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const t = useTranslate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div><h1 className="font-bold">{t("courierDashboard")}</h1></div>
      <CourierNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-2">
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}
