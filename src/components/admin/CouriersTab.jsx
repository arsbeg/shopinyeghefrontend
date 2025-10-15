import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CouriersTab() {
  const [couriers, setCouriers] = useState([]);

  const fetchCouriers = async () => {
    try {
      const res = await api.get("/couriers/all"); // сделаем потом этот endpoint
      setCouriers(res.data);
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Couriers</h2>
      <p className="text-gray-500 mb-2">Вкладка в разработке</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Active Deliveries</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((c) => (
            <tr key={c.id} className="text-center">
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.active_deliveries || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
