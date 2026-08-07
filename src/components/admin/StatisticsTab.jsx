import React, { useEffect, useState } from "react";
import StatNavBar from "./StatisticsTabs/StatNavBar";
import ByTotalIncome from "./StatisticsTabs/ByTotalIncome";
import Tab1 from "./StatisticsTabs/Tab1";
//import api from "../../api/axios";
//import { API_BASE_URL } from "../../config";
//import { useAuth } from "../../context/AuthContext";
//import StoreRevenueChart from "./charts/StoreRevenueChart";

export default function StatisticsTab() {
  const [activeTab, setActiveTab] = useState("bytotalincome");
  
    return (
      <div className="min-h-screen bg-gray-100">
        <div><h1 className="font-bold">Different Statistical Data for admin</h1></div>
        <StatNavBar activeTab={activeTab} onTabChange={setActiveTab} />
  
        <main className="p-2 ">
          {activeTab === "bytotalincome" && <ByTotalIncome />}
          {activeTab === "tab1" && <Tab1 />}
          {/*{activeTab === "tab2" && <Tab2 />}
          {activeTab === "tab3" && <Tab3 />}
          {activeTab === "tab4" && <Tab4 />}
          {activeTab === "tab5" && <Tab5 />}
          {activeTab === "tab6" && <Tab6 />}*/}
        </main>
      </div>
    );
}