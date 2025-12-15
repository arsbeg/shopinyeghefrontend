import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCount(0);
        return;
      }

      const res = await api.get("/Orders/get_basket", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalQty = (res.data || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCount(totalQty);
    } catch (err) {
      console.error("Cart count error:", err);
      setCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ count, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
