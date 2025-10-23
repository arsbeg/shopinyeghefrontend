import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_BASE_URL } from "../../config";
import AddStoreModal from "../../components/admin/AddStoreModal";
import EditStoreModal from "./EditStoreModal";
import { useAuth } from "../../context/AuthContext";

export default function StoresTab() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [editStore, setEditStore] = useState(null); // 🔹 новый стейт для редактирования
  const { token } = useAuth();

  const handleAdded = () => {
    // обновляем список магазинов
    fetchStores();
  };
  const handleUpdated = () => fetchStores();

  const handleEdit = (store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const handleEditSaved = () => {
    fetchStores();
    setEditStore(null);
  };

  const fetchStores = async () => {
    try {
      const res = await api.get("/Store/all");
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter((s) =>
    s.st_name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 функция удаления
  const handleDelete = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      await api.delete(`/Store/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Store deleted successfully");
      fetchStores(); // обновляем список
    } catch (err) {
      console.error("Error deleting store:", err);
      alert("Failed to delete store");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stores</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 rounded-full text-white bg-green-800  hover:bg-green-600 mb-4 cursor-pointer"
      >
        + Add new store
      </button>
      <input
        type="text"
        placeholder="Search store..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full text-sm text-center rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-900 uppercase bg-gray-50">
          <tr className="bg-blue-300">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Manager</th>
            <th className="px-6 py-3 text-left">Photo</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="text-center odd:bg-white even:bg-blue-50 border-b border-gray-200">
              <td className="px-6 py-3">{s.id}</td>
              <td className="px-6 py-3">{s.st_name}</td>
              <td className="px-6 py-3">{s.username || "-"}</td>
              <td className="px-6 py-3">
                <img
                  src={`${API_BASE_URL}${s.st_image}`}
                  alt={s.st_name}
                  className="w-15 h-15 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-3">
                <button 
                    onClick={() => handleEdit(s)}
                    className="px-3 py-1 rounded-full text-white bg-yellow-600  hover:bg-yellow-400 cursor-pointer">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="px-3 py-1 rounded-full text-white bg-red-600  hover:bg-red-400 ml-2 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={handleAdded}
      />

      {selectedStore && (
        <EditStoreModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={handleUpdated}
          store={selectedStore}
        />
      )}
    </div>
  );
}
