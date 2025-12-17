import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement("#root");

export default function EditCategoryModal({ isOpen, onClose, onUpdated, category }) {
  const { token, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    cat_name: "",
    cat_name_arm: "",
  });

// заполняем форму текущими данными магазина
  useEffect(() => {
    if (category) {
      setForm({
        cat_name: category.cat_name || "",
        cat_name_arm: category.cat_name_arm || "",
      });
    }
  }, [category]);

  // console.log(category.id)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const payload = { ...form };
      await api.put(`/Category/${category.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Category updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating Category:", err);
      alert("Failed to update Category");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Category Name</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Category Name"
          className="border p-2 rounded w-full"
          value={form.cat_name}
          onChange={(e) => setForm({ ...form, cat_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Բաժնի անվանումը"
          className="border p-2 rounded w-full"
          value={form.cat_name_arm}
          onChange={(e) => setForm({ ...form, cat_name_arm: e.target.value })}
          required
        />


        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
