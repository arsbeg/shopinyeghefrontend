import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function OrdersTab() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderStores, setOrderStores] = useState({});
  const allowedStatuses = ["created", "packaging", "ready"]

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/Orders/get_orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data.filter((o) => allowedStatuses.includes(o.status) & !o.courier_id));
    } catch (err) {
      console.error("Error fetching courier orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders(); // run only once
  }, []);

  const fetchOrderStores = async (o_id) => {
    try {
      const res = await api.get(`/Orders/order_stores/${o_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderStores((prev) => ({ ...prev, [o_id]: res.data }));
    } catch (err) {
      console.error("Error fetching store ordered items:", err);
    }
  };

  // fetch stores after orders arrive
  useEffect(() => {
    orders.forEach((o) => fetchOrderStores(o.id));
  }, [orders]);

  return (
    <div>
      <h1>Orders: Under construction</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-3 grid grid-col-4"
        >
          <div className={order.status ==="ready" ? "bg-green-200 rounded-2xl p-1" : "bg-white rounded-2xl p-1"}>
            Stores in —
            <span className="text-blue-700 font-bold">
              {" "}
              🧾 Order #{order.id}{"   "}
            </span>
            Status#
            <span className={order.status === "ready" ? "text-green-900 font-bold" : "text-gray-900"}>
              {"   "}
              {order.status}
            </span>
            {orderStores[order.id]?.length > 0 ? (
              orderStores[order.id].map((store) => (
                <div
                  key={store.store_id}
                  className="mt-1 rounded-xl p-[2px] grid grid-col-4"
                >
                  <p className="text-sm font-semibold text-blue-700">
                    {store.st_name}--{store.address}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Stores</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
