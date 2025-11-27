import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function OrdersTab() {
  const { token, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);

  const fetchStores = async () => {
    try {
      const res = await api.get(`/Store/all`);
      setStores(res.data.filter((s) => s.owner_id == user.id));
    } catch (err) {
      console.error("Error fetching manager stores:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchStores();
  }, [user]);

  const fetchOrderedItems = async (st_id) => {
    try {
      const respond = await api.get(`/Orders/store_ordered_items/${st_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderedItems((prev) => ({ ...prev, [st_id]: respond.data }));
    } catch (err) {
      console.error("Error fetching current store ordered items");
    }
  };

  useEffect(() => {
    stores.forEach((s) => fetchOrderedItems(s.id));
  }, [stores]);

  return (
    <div>
      <h1>Orders: Under construction</h1>
      {stores.map((store) => (
        <div
          key={store.id}
          className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-3"
        >
          <div className="bg-white rounded-2xl p-1">
            Orders in —{" "}
            <span className="text-blue-700 font-bold">{store.st_name}</span>
            {orderedItems[store.id]?.length > 0 ? (
              Object.values(
                orderedItems[store.id].reduce((acc, item) => {
                  if (!acc[item.order_id]) acc[item.order_id] = [];
                  acc[item.order_id].push(item);
                  return acc;
                }, {})
              ).map((items, index) => (
                <div key={index} className="ml-4 mt-2 border-l pl-3">
                  <p className="font-bold text-green-600">Order #{items[0].order_id}</p>

                  {items.map((oi) => (
                    <p key={oi.id}>
                      {oi.pr_name} — {oi.cur_price}֏--{oi.quantity}pcs
                    </p>
                  ))}
                </div>
              ))
            ) : (
              <p>No orders yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
