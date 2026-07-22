
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNot } from "../context/NotContext";
import { useLang } from "../context/LanguageContext";
import { tField } from "../utils/tField";
import { useTranslate } from "../utils/useTranslate";

export default function NotificationsPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchNotCount } = useNot();
  const { lang } = useLang();
  const t = useTranslate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/Notifications/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotes(res.data || []);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // ✅ FIXED
  const handleRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/Notifications/make_read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ⭐ update UI instantly
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );

      // ⭐ update navbar badge
      fetchNotCount();
    } catch (err) {
      console.error("Reading error:", err);
      alert("Reading failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-2">
      <div className="space-y-3">
        {notes.map((item) => (
          <div
            key={item.id}
            onClick={() => handleRead(item.id)}
            className={`flex items-center justify-between p-4 rounded-xl shadow-md cursor-pointer transition
              ${
                item.is_read
                  ? "bg-gray-100 text-gray-500"
                  : "bg-white hover:bg-blue-50"
              }`}
          >
            <div>
              <h2 className="text-sm md:text-lg font-semibold">
                {item.created_at}
              </h2>

              <p
                className={`text-sm md:text-base font-medium ${
                  item.is_read ? "" : "text-blue-700"
                }`}
              >
                {tField(item, "notification", lang)}
              </p>
            </div>

            {!item.is_read && (
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
