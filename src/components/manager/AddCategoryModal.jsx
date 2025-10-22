import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement("#root");

export default function AddCategoryModal({ isOpen, onClose, onAdded, store }) {
  const { token, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    cat_name: "",
    store_id: store.id,
  });

  // console.log(store.id)


  {/*useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get("/Store/all");
        const onlyStores = res.data.filter(
          (s) => s.owner_id == user.id
        );
        setStores(onlyStores);
      } catch (err) {
        console.error("Error loading stores:", err);
      }
    };
    if (isOpen) fetchStores();
  }, [isOpen]);*/}



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const payload = { ...form };
      await api.post("/Category/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Category added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error("Error adding Category:", err);
      alert("Failed to add Category");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Category Name"
          className="border p-2 rounded w-full"
          value={form.cat_name}
          onChange={(e) => setForm({ ...form, cat_name: e.target.value })}
          required
        />

        <p>
            <span className="font-bold">Shop:  </span>
            <span>{store.st_name}</span>
        </p>

        {/*<select
          className="border p-2 rounded w-full"
          value={form.store_id}
          onChange={(e) => setForm({ ...form, store_id: e.target.value })}
          required
        >
          <option value="">Select Store</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.st_name}
            </option>
          ))}
        </select>*/}


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
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}
