import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { API_BASE_URL } from "../config";
import Addresses from "../components/Addresses";
import UserOrders from "../components/UserOrders";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LanguageContext";
import { tField } from "../utils/tField";
import { useTranslate } from "../utils/useTranslate";

export default function BasketPage() {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [refreshOrders, setRefreshOrders] = useState(0);
  const { fetchCartCount } = useCart();
  const { lang } = useLang();
  const t = useTranslate();

  // === fetching basket ===
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


  // === Change quantity (via API) ===
  const updateQuantity = async (orderId, optionId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/Orders/basket_change_quantity/${orderId}/${optionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update basket
      const res = await api.get("/Orders/get_basket", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBasketItems(res.data || []);
      fetchCartCount();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // === Delete products ===
  const removeItem = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/Orders/delete_from_basket/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Localy Delete
      setBasketItems((prev) => prev.filter((item) => item.id !== orderId));
      fetchCartCount();
    } catch (err) {
      console.error("Error deleting from basket:", err);
    }
  };

  // === Total SUM ===
  const totalPrice = basketItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const totalWithSheeping = totalPrice + selectedAddress?.price

  // === Checkout ===
  const handleCheckout = async () => {
    if (!selectedAddress) return alert("Please select an address");
    if (!window.confirm("Is Your selected address correct?")) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await api.post(
        "/Orders/checkout",
        { address_id: selectedAddress.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Order N- ${response.data.order_id} created with total amount of ${response.data.total_amount}!`);
      // Update basket
      const res = await api.get("/Orders/get_basket", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBasketItems(res.data || []);
      navigate("/basket");
      setRefreshOrders(prev => prev + 1);
      fetchCartCount();

    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (basketItems.length === 0)
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4 text-center mt-10">
        <h2 className="text-xl font-semibold">{t("basketEmpty")}</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-500"
        >
          Go to shop
        </button>
        <Addresses onSelect={(addressData) => setSelectedAddress(addressData)} />
        <UserOrders refreshTrigger={refreshOrders} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-0">
      <h1 className="text-2xl font-bold mb-6 text-center">🛒 {t("basket")}</h1>

      <div className="space-y-2 md:space-y-4">
        {basketItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md p-2 md:p-4 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              {item.image && (
                <img
                  src={`${API_BASE_URL}${item.image}`}
                  alt={item.pr_name}
                  className="w-10 md:w-15 lg:w-20  h-10 md:h-15 lg:h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-sm md:text-lg font-semibold">{tField(item, "pr_name", lang)}</h2>
                <p className="text-xs md:text-base text-green-600 font-bold">{item.price} ֏</p>
                <p className="text-xs md:text-base text-gray-400">{tField(item, "st_name", lang)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-0 md:space-x-2">
              <button
                onClick={() => updateQuantity(item.id, 0)}
                className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 text-white flex items-center justify-center bg-red-500 hover:bg-red-300 rounded-full text-lg font-bold transition"
              >
                −
              </button>
              <span className="min-w-[24px] text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 text-white flex items-center justify-center bg-green-500 hover:bg-green-300 rounded-full text-lg font-bold transition"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="bg-white hover:rotate-45 px-3 py-1 rounded-full transition cursor-pointer"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right border-t border-purple-500 pt-4">
        <p className="text-sm font-semibold mb-0">
          {t("total")}:{" "}
          <span className="text-green-600 font-bold">{totalPrice} ֏</span>
        </p>
        <p className="text-sm font-semibold mb-3">
          {t("sheeping")}:{" "}
          <span className="text-green-600 font-bold">{selectedAddress?.price} ֏</span>
        </p>
        <div className="border-b border-purple-500"></div>
        <p className="text-lg font-semibold mb-3">
          {t("topay")}:{" "}
          <span className="text-green-600 font-bold">{totalWithSheeping} ֏</span>
        </p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-1 md:px-6 md:py-2 text-sm md:text-base lg:text-lg rounded-full hover:bg-green-500 transition"
        >
          {t("checkout")}
        </button>
      </div>
      <Addresses onSelect={(addressData) => setSelectedAddress(addressData)} />
      <UserOrders refreshTrigger={refreshOrders} />
    </div>
  );
}
