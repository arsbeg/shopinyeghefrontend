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
          className={
              order.status === "ready"
                ? "bg-green-500 to-white rounded-2xl px-0 mb-3 shadow-md/50"
                : order.status === "packaging"
                ? "bg-yellow-500 rounded-2xl px-0 mb-3 shadow-md/50"
                : order.status === "assigned"
                ? "bg-sky-500 rounded-2xl px-0 mb-3 shadow-md/50"
                : order.status === "on the way"
                ? "bg-purple-500 rounded-2xl px-0 mb-3 shadow-md/50"
                : order.status === "complete"
                ? "bg-red-500 rounded-2xl px-0 mb-3 shadow-md/50"
                : "bg-gray-400 rounded-2xl px-0 mb-3 shadow-md/50"
            }
        >
          <div
            className="rouded 2xl"
          >
            <div className="rounded-t-2xl px-3 flex flex-col-2 justify-between">
              <div>
                <span className="text-white font-bold">
                  🧾Order #{order.id}
                </span>
              </div>
              <div className="flex flex-col-3 gap-2">
                Status<div className="animate-spin rounded-full size-4 border-b-2 border-white mt-1"></div>
                <span
                  className="text-white font-bold"
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-b-2xl px-3">
              <p className="text-sm">👤 {order.first_name}</p>
              <p className="text-sm">🏡 {order.city}, {order.address}</p>
              <p className="text-sm">☎ {order.phone_number}</p>
              <p className="text-sm">🚕💵 {order.price} ֏</p>
              {orderStores[order.id]?.length > 0 ? (
                orderStores[order.id].map((store) => (
                  <div
                    key={store.store_id}
                    className="mt-1 rounded-xl p-[2px] grid grid-col-4"
                  >
                    <p className="text-sm font-semibold text-gray-700">
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
                    className="bg-gradient-to-b from-green-500 to-gray-100 shadow-md/50 hover:shadow-sm/50 text-black text-sm px-2 py-1 mb-2 w-full rounded-b-2xl cursor-pointer px-3"
                  >
                    Accept
                  </button>
                </div>
              )}
              {order.status === "assigned" && (
                <div className="flex grid grid-col-3 place-items-end">
                  <button
                    onClick={() => handleOnWay(order.id)}
                    className="bg-gradient-to-b from-blue-500 to-gray-100 shadow-md/50 hover:shadow-sm/50 text-black text-sm px-2 py-1 mb-2 w-full rounded-b-2xl cursor-pointer"
                  >
                    On the Way
                  </button>
                </div>
              )}
              {order.status === "on the way" && (
                <div className="flex grid grid-col-3 place-items-end">
                  <button
                    onClick={() => handleComplete(order.id)}
                    className="bg-gradient-to-b from-purple-500 to-gray-100 shadow-md/50 hover:shadow-sm/50 text-black text-sm px-2 py-1 mb-2 w-full rounded-b-2xl cursor-pointer"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
