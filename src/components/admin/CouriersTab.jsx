import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function CouriersTab() {
  const [couriers, setCouriers] = useState([]);
  const { token } = useAuth();

  const fetchCouriers = async () => {
    if (!token) return;

    try {
      const res = await api.get("/Users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCouriers(res.data.filter(u => u.us_role == "user"));
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  return (
    <div className="bg-blue-50">
      <h2 className="text-xl font-semibold mb-4">Couriers</h2>
      <p className="text-gray-500 mb-2">Under construction!!!</p>
      <table className="w-full text-sm text-center rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-900 uppercase bg-gray-50">
          <tr className="bg-blue-300">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Userame</th>
            <th className="px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((c) => (
            <tr key={c.id} className="text-center odd:bg-white even:bg-blue-50 border-b border-gray-200">
              <td className="px-6 py-3">{c.id}</td>
              <td className="px-6 py-3">{c.username}</td>
              <td className="px-6 py-3">{c.us_role || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
