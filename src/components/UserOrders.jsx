import React, { useEffect, useState } from "react";
import api from "../api/axios";
import OrderedPrCard from "./OrderedPrCard";
import OrderStatus from "./OrderStatus";

export default function UserOrders({ refreshTrigger = 0 }) {
  const [orders, setOrders] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Load current user orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Orders/get_orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data || []);

    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };


    // Load current user ordered items
  const fetchOrderedItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Orders/get_ordered_items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderedItems(response.data || []);

    } catch (err) {
      console.error("Error loading ordered items:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderedItems();
  }, [refreshTrigger]);


  // cancel order
  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel order?")) return;
    alert("Cancel operation is currently unavailable");
    return;

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/Orders/cancel/${id}`,
        { address: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditId(null);
      setEditValue("");
      await fetchAddresses();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };


  return (
    <div className="bg-gradient-to-b from-sky-50 to-sky-200 p-4 rounded-xl shadow-md mt-8">
      <h2 className="text-base md:text-xl lg:text-2xl font-semibold mb-4">🛒 My Orders</h2>

      {/* List of orders */}
      <div className="space-y-3 mb-4">
        {orders.length === 0 && (
          <p className="text-gray-500">No any orders yet</p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="w-full flex flex-col bg-white text-xs md:text-base lg:text-xl justify-between gap-1 md:gap-2 lg:gap-3 shadow-lg/20 rounded-lg px-1 py-1"
          >
            <div className="border-b border-purple-600 flex justify-between items-center">
              <div className="flex text-gray-800 text-[9px] md:text-base">
                🧾Order #{order.id}
              </div>
              <div className="flex text-gray-800 text-[9px] md:text-base">
                Total amout:--- <span className="text-green-700 font-bold">{order.total_amount}֏</span>
              </div>
              {/* Cancel order */}
              <div>
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="px-3 py-1 bg-white text-white rounded-lg hover:rotate-30 transition"
                >
                  🗑️
                </button>
              </div>
            </div>           
            <div className="flex w-full overflow-x-auto snap-x snap-mandatory gap-5">
                {orderedItems
                  .filter(item => item.order_id === order.id)
                  .map(item => (
                    <OrderedPrCard key={item.id} product={item} />
                  ))
                }
            </div>
            <div>
              <OrderStatus status={order.status} />
            </div>
            <div className="flex justify-between text-gray-800 text-[9px] md:text-base">
              <div className="flex text-gray-800 text-[9px] md:text-base">
                Updated at: {order.updated_at}
              </div>
              <div className="flex text-gray-800 text-[9px] md:text-base">
                Ordered at: {order.created_at}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
