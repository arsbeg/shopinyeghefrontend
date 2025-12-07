import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function OrdersTab() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderStores, setOrderStores] = useState({});
  const allowedStatuses = ["created", "packaging", "ready"];
  //console.log(user.id);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/Orders/get_orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(
        res.data.filter(
          (o) =>
            allowedStatuses.includes(o.status) ||
            !o.courier_id ||
            Number(o.courier_id) === Number(user.id)
        )
      );
    } catch (err) {
      console.error("Error fetching courier orders:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchOrders(); // run only once
  }, [user]);

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
    if (orders.length > 0) {
      orders.forEach((o) => fetchOrderStores(o.id));
    }
  }, [orders]);

  const handleAccept = async (orderId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.put(
        `/Orders/update_order_assigned/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error changing status assigned");
    }
  };

  const handleOnWay = async (orderId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.put(
        `/Orders/update_order_on_way/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error changing status on the way");
    }
  };

  const handleComplete = async (orderId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.put(
        `/Orders/update_order_complete/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error changing status complete");
    }
  };


  return (
    <div>
      <h1>Orders: Under construction</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl shadow-md/50 mb-3 grid grid-col-4"
        >
          <div
            className={
              order.status === "ready"
                ? "bg-green-300 rounded-2xl px-3"
                : order.status === "assigned"
                ? "bg-sky-300 rounded-2xl px-3"
                : order.status === "on the way"
                ? "bg-purple-300 rounded-2xl px-3"
                : order.status === "complete"
                ? "bg-red-600 rounded-2xl px-3 text-white"
                : "bg-pink-300 rounded-2xl px-3"
            }
          >
            Stores in---
            <span className="text-blue-700 font-bold">
              {" "}
              🧾Order #{order.id}
              {"  "}
            </span>
            Status---
            <span
              className={
                order.status === "ready"
                  ? "text-green-900 font-bold"
                  : "text-gray-900"
              }
            >
              {"   "}
              {order.status}
            </span>
            <p className="text-sm">Sheeping address:-- {order.address}</p>
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
              <p className="text-gray-500">No Orders for now</p>
            )}
            {order.status === "ready" && (
              <div className="flex grid grid-col-3 place-items-end">
                <button
                  onClick={() => handleAccept(order.id)}
                  className="bg-gradient-to-b from-green-500 to-white-500 shadow-md/50 text-black text-sm px-2 mb-1 rounded-full cursor-pointer"
                >
                  Accept
                </button>
              </div>
            )}
            {order.status === "assigned" && (
              <div className="flex grid grid-col-3 place-items-end">
                <button
                  onClick={() => handleOnWay(order.id)}
                  className="bg-gradient-to-b from-blue-500 to-white-500 shadow-md/50 text-black text-sm px-2 mb-1 rounded-full cursor-pointer"
                >
                  On the Way
                </button>
              </div>
            )}
            {order.status === "on the way" && (
              <div className="flex grid grid-col-3 place-items-end">
                <button
                  onClick={() => handleComplete(order.id)}
                  className="bg-gradient-to-b from-purple-500 to-white-500 shadow-md/50 text-black text-sm px-2 mb-1 rounded-full cursor-pointer"
                >
                  Complete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
