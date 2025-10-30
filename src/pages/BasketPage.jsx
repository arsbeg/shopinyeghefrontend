import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { API_BASE_URL } from "../config";

export default function BasketPage() {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // === Загружаем корзину ===
  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/Orders/get_basket", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBasketItems(res.data || []);
      } catch (error) {
        console.error("Error loading basket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBasket();
  }, [navigate]);

  // === Изменение количества (через API) ===
  const updateQuantity = async (orderId, optionId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/orders/basket_change_quantity/${orderId}/${optionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Обновляем корзину после изменения
      const res = await api.get("/Orders/get_basket", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBasketItems(res.data || []);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // === Удаление товара ===
  const removeItem = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/Orders/delete_from_basket/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Удаляем локально
      setBasketItems((prev) => prev.filter((item) => item.id !== orderId));
    } catch (err) {
      console.error("Error deleting from basket:", err);
    }
  };

  // === Подсчёт общей суммы ===
  const totalPrice = basketItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // === Оформить заказ ===
  const handleCheckout = () => {
    alert("🛒 Order placed successfully!");
    navigate("/");
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading cart...</p>;

  if (basketItems.length === 0)
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">Your basket is empty</h2>
        <button
          onClick={() => navigate("/store")}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500"
        >
          Go to shop
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">🛒 Your Basket</h1>

      <div className="space-y-4">
        {basketItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md p-4 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              {item.image && (
                <img
                  src={`${API_BASE_URL}${item.image}`}
                  alt={item.pr_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold">{item.pr_name}</h2>
                <p className="text-gray-600">{item.price} ֏</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, 0)}
                className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-400"
              >
                −
              </button>
              <span className="min-w-[24px] text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="px-3 py-1 bg-green-500 text-white rounded-xl hover:bg-green-400"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-600 px-3 py-1 rounded-full transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right border-t pt-4">
        <p className="text-lg font-semibold mb-3">
          Total:{" "}
          <span className="text-green-600 font-bold">{totalPrice} ֏</span>
        </p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-500 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
