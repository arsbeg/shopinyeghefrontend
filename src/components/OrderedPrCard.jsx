import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { API_BASE_URL } from "../config";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LanguageContext";
import { useTranslate } from "../utils/useTranslate";
import { tField } from "../utils/tField";


export default function OrderedPrCard({ product }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate()
  const quantity = 1
  const { fetchCartCount } = useCart();
  const t = useTranslate();
  const { lang } = useLang();

  const addToBasket = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(
        `/Orders/add_to_basket/${product.product_id}/${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartCount();
      alert("Adding to card");      
    } catch (err) {
      alert("Error adding to cart or session time out");
      console.error(err);
      navigate("/login");
    }
  };

  return (
    <div className="mb-1 snap-center min-w-25 bg-gradient-to-b from-sky-50 to-sky-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-2 flex flex-col items-center text-center relative group max-w-80">
      {/* Photo */}
      <div className="relative max-w-40 max-h-40 mb-2">
        <img
          src={`${API_BASE_URL}${product.image}`}
          alt={product.pr_name}
          className="w-20 h-20 md:w-25 md:h-25 lg:w-35 lg:h-35 object-cover rounded-xl shadow-lg/50 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product name and price */}
      <h3 className="font-semibold text-sm md:text-base text-gray-800 truncate max-w-[160px]">
        {tField(product, "pr_name", lang)}
      </h3>
      <h1 className="text-[9px] md:text-[12px] text-gray-800 truncate max-w-[160px]">
        {tField(product, "st_name", lang)}
      </h1>
      <p className="text-green-700 font-bold mt-1 text-sm md:text-base lg:text-lg">
        {product.cur_price.toLocaleString()} ֏
      </p>

      {/* Button */}
      <button
        onClick={addToBasket}
        className="mt-1 bg-blue-600 text-white py-1 px-2 rounded-xl font-semibold hover:bg-blue-700 text-[10px] md:text-sm lg:text-base active:scale-95 transition-transform duration-150"
      >
        🛒 {t("addToCart")}
      </button>
    </div>
  );
}