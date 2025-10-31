// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/Users/info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email_address || "",
          birthday: res.data.birthday || "",
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setIsChanged(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put(
        "/Users/info",
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          birthday: formData.birthday,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsChanged(false);
    } catch (err) {
      console.error("Error saving user info:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg/50 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Profile</h2>

      {/* === Avatar Section === */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative">
          <img
            src={`${API_BASE_URL}/static/images/avatar/default_avatar.png`}
            alt="User avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-green-500"
          />
          <button
            disabled
            className="absolute bottom-0 right-0 bg-green-600 text-white text-sm px-3 py-1 rounded-full opacity-80 cursor-not-allowed"
          >
            ✏️Change
          </button>
        </div>
        <p className="mt-3 text-gray-500 text-sm italic">
          (Avatar editing coming soon)
        </p>
      </motion.div>

      {/* === Info Form === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isChanged || isSaving}
          className={`px-6 py-2 rounded-full text-white transition ${
            isChanged
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? "💾Saving..." : "💾Save"}
        </button>
      </div>

      {/* === Change Password Section === */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 border-t pt-6"
      >
        <h3 className="text-lg font-semibold mb-3">Change Password</h3>
        <p className="text-gray-500 italic mb-4">
          (Password change feature coming soon)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            disabled
            type="password"
            placeholder="Current password"
            className="border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
          <input
            disabled
            type="password"
            placeholder="New password"
            className="border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
          <input
            disabled
            type="password"
            placeholder="Confirm new password"
            className="border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          disabled
          className="mt-4 px-6 py-2 bg-gray-400 text-white rounded-full cursor-not-allowed"
        >
          ✏️Change Password
        </button>
      </motion.div>
    </div>
  );
}
