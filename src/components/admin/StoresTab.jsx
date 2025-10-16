import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_BASE_URL } from "../../config";
import AddStoreModal from "../../components/admin/AddStoreModal"

export default function StoresTab() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdded = () => {
    // обновляем список магазинов
    fetchStores();
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Stores</h2>
      <button
        onClick={() => setIsModalOpen(true)} 
        className="px-3 py-1 rounded text-white bg-green-800  hover:bg-green-600 mb-4">
        Add new store
      </button>
      <input
        type="text"
        placeholder="Search store..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Manager</th>
            <th className="border p-2">Photo</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="text-center">
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.st_name}</td>
              <td className="border p-2">{s.username || "-"}</td>
              <td className="border p-2">
                <img
                      src={`${API_BASE_URL}${s.st_image}`}
                      alt={s.st_name}
                      className="w-15 h-15 object-cover rounded-lg"
                        />
              </td>
              <td className="border p-2">
                <button className="px-3 py-1 rounded text-white bg-yellow-600  hover:bg-yellow-400">
                    Edit
                </button>
                <button className="px-3 py-1 rounded text-white bg-red-600  hover:bg-red-400 ml-2">
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
    </div>
  );
}
