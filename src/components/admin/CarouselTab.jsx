import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_BASE_URL } from "../../config";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import { useAuth } from "../../context/AuthContext";

export default function CarouselTab() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null); // 🔹 новый стейт для редактирования
  const { token } = useAuth();

  const handleAdded = () => {
    // обновляем список магазинов
    fetchItems();
  };
  const handleUpdated = () => fetchItems();

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSaved = () => {
    fetchItems();
    setEditItem(null);
  };

  const fetchItems = async () => {
    try {
      const res = await api.get("/Carousel/all");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching Carousel items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);


  // 🔹 функция удаления
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.delete(`/Carousel/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Image deleted successfully");
      fetchStores(); // обновляем список
    } catch (err) {
      console.error("Error deleting store:", err);
      alert("Failed to delete store");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Carousel Images</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 rounded-full text-white bg-green-800  hover:bg-green-600 mb-4 cursor-pointer"
      >
        + Add new Image
      </button>
      <table className="w-full text-sm text-center rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-900 uppercase bg-gray-50">
          <tr className="bg-blue-300">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Added at</th>
            <th className="px-6 py-3 text-left">Photo</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="text-center odd:bg-white even:bg-blue-50 border-b border-gray-200">
              <td className="px-6 py-3">{it.id}</td>
              <td className="px-6 py-3">{it.img_name}</td>
              <td className="px-6 py-3">{it.created_at || "-"}</td>
              <td className="px-6 py-3">
                <img
                  src={`${API_BASE_URL}${it.carousel_image}`}
                  alt={it.img_name}
                  className="w-full h-15 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-3">
                <button 
                    onClick={() => handleEdit(it)}
                    className="px-3 py-1 rounded-full text-white bg-yellow-600  hover:bg-yellow-400 cursor-pointer">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(it.id)}
                  className="px-3 py-1 rounded-full text-white bg-red-600  hover:bg-red-400 ml-2 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={handleAdded}
      />

      {selectedItem && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={handleUpdated}
          item={selectedItem}
        />
      )}
    </div>
  );
}
