import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import { API_BASE_URL } from "../config";

export default function BasketPage() {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Загружаем корзину при загрузке страницы
  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log({ token });
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/Orders/get_basket", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBasketItems(response.data || []);
      } catch (error) {
        console.error("Error Loading Cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBasket();
  }, [navigate]);

  // Подсчёт общей суммы
  const totalPrice = basketItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Увеличить/уменьшить количество (пока локально)
  const updateQuantity = (id, delta) => {
    setBasketItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  // Удалить товар
  const removeItem = (id) => {
    setBasketItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Оформить заказ
  const handleCheckout = () => {
    alert("🛒 Order finished!");
    navigate("/");
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading cart...</p>;

  if (basketItems.length === 0)
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">Cart is empty</h2>
        <button
          onClick={() => navigate("/store")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          To shop
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">🛒 Your cart</h1>

      <div className="space-y-4">
        {basketItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
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
                onClick={() => updateQuantity(item.id, -1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-lg font-semibold mb-2">
          Total: <span className="text-blue-600">{totalPrice} ֏</span>
        </p>
        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
        >
          Checkuot
        </button>
      </div>
    </div>
  );
}
