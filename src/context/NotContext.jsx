import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const NotContext = createContext(null);

export const NotProvider = ({ children }) => {
  const [ncount, setNcount] = useState(0);

  const fetchNotCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNcount(0);
        return;
      }

      const res = await api.get("/Notifications/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const unreardCount = (res.data || []).filter(
        (n) => !n.is_read,
        
      ).length;

      setNcount(unreardCount);
    } catch (err) {
      console.error("Notifications count error:", err);
      setNcount(0);
    }
  };

  useEffect(() => {
    fetchNotCount();
  }, []);

  console.log(ncount);

  return (
    <NotContext.Provider value={{ ncount, fetchNotCount }}>
      {children}
    </NotContext.Provider>
  );
};

export const useNot = () => useContext(NotContext);