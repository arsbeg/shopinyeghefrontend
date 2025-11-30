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

  const getStoreOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + item.cur_price * item.quantity, 0);
  };


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
              ).map((items) => {
                const orderId = items[0].order_id;
                const storeTotal = getStoreOrderTotal(items);

                return (
                  <div
                    key={orderId}
                    className="mt-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl p-[2px]"
                  >
                    <div className="bg-white rounded-xl p-4 space-y-2">
                      {/* HEADER */}
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold text-blue-700">
                          🧾 Order #{orderId}
                        </div>

                        <div className="text-sm md:text-base font-bold text-green-700">
                          Total: {storeTotal} AMD
                        </div>
                      </div>

                      <div className="border-t border-gray-200 my-1"></div>

                      {/* ITEMS */}
                      <div className="space-y-2">
                        {items.map((oi) => (
                          <div
                            key={oi.id}
                            className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {oi.pr_name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {oi.quantity} × {oi.cur_price}
                              </p>
                            </div>

                            <OrderItemCheckbox item={oi} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No orders yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


function OrderItemCheckbox({ item }) {
  const { token } = useAuth();
  const [ready, setReady] = useState(item.ready);
  const updateReady = async () => {
    try {
      await api.put(
        `/Orders/update_ready/${item.id}`,
        { ready: ready ? 0 : 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReady(!ready);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <label onClick={updateReady} className="flex items-center gap-2 cursor-pointer">
      <span className={ready ? "text-sm text-green-500 font-medium" : "text-sm font-medium"}>
        {ready ? "✅Ready" : "☐Pending"}
      </span>
    </label>
  );
}