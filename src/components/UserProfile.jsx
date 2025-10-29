import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
  });
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/Users/info`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setIsChanged(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/Users/info`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsChanged(false);
    } catch (err) {
      console.error("Error updating user info:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 bg-white shadow-xl/30 shadow-blue-900/100 rounded-2xl p-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        👤 My Profile
      </h1>

      <div className="space-y-5">
        <div>
          <label className="block text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="text-sm text-gray-500 mt-2">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Role:</strong> {user.us_role}
          </p>
          <p>
            <strong>Created:</strong> {user.created_at}
          </p>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={!isChanged || saving}
          whileHover={{ scale: isChanged ? 1.05 : 1 }}
          className={`w-full py-3 rounded-xl mt-4 font-semibold text-white transition-colors ${
            isChanged
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </motion.button>
      </div>
    </motion.div>
  );
}
