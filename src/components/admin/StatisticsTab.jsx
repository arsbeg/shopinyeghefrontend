import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import StoreRevenueChart from "./charts/StoreRevenueChart";

export default function StatisticsTab() {
  const [stores, setStores] = useState([]);
  const { token } = useAuth();

  const fetchStores = async () => {
    if (!token) return;

    try {
      const res = await api.get("/Statistics/total_by_store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);


  return (
    <div>
      <h2 className="text-sm md:text-base lg:text-xl font-semibold mb-4">Total order statistics by Stores</h2>

      <table className="w-full text-[8px] md:text-[10px] lg:text-[12px] text-center rtl:text-right text-gray-500">
        <thead className="text-gray-900 uppercase bg-gray-50">
          <tr className="bg-blue-300">
            <th className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">ID</th>
            <th className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">Name</th>
            <th className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3 text-left">Photo</th>
            <th className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.store_id} className="text-center odd:bg-white even:bg-blue-50 border-b border-gray-200">
              <td className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">{s.store_id}</td>
              <td className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">{s.st_name}</td>
              <td className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">
                <img
                  src={`${API_BASE_URL}${s.st_image}`}
                  alt={s.st_name}
                  className="w-5 md:w-10 lg:w-15 h-5 md:h-10 lg-h-15  object-cover rounded-lg"
                />
              </td>
              <td className="px-1 py-1 md:px-3 md:py-2 lg:px-6 lg:py-3">{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <StoreRevenueChart data={stores} />
    </div>
  );
}