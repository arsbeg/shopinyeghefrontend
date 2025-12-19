import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newCity, setNewCity] = useState("");
  const [newCityArm, setNewCityArm] = useState("");
  const [newPrice, setNewPrice] = useState("")
  const [add, setAdd] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState("");

  const [editId, setEditId] = useState(null);
  const [editCity, setEditCity] = useState("");
  const [editCityArm, setEditCityArm] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Addresses/cities/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCities(response.data || []);
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  };

  useEffect(() => {
      fetchCities();
    }, []);

  // Create new Ciy
  const addCity = async () => {
    if (!newCity.trim()) return alert("Enter address");

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/Addresses/add_city",
        { city: newCity, city_arm: newCityArm, price: newPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewCity("");
      setNewCityArm("");
      setNewPrice("");
      await fetchCities();
      setAdd(null);
    } catch (err) {
      console.error("Add address error:", err);
    }
  };

  // Delete address
  const deleteCity = async (id) => {
    if (!window.confirm("Delete this city?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/Addresses/city/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCities();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Save edited address
  const saveEdit = async (id) => {
    if (!editCity.trim()) return alert("Enter valid address");

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/Addresses/city/${id}`,
        { city: editCity, city_arm: editCityArm, price: editPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditId(null);
      setEditCity("");
      setEditCityArm("");
      setEditPrice("");
      await fetchCities();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-sky-50 to-sky-200 p-4 rounded-xl shadow-md mt-8">
      <h2 className="text-base md:text-xl lg:text-2xl font-semibold mb-4">
        📍 Places for delivery in Yeghegnadzor
      </h2>

      {/* List of addresses */}
      <div className="space-y-3 mb-4">
        {cities.length === 0 && (
          <p className="text-gray-500">No saved cities yet</p>
        )}

        {cities.map((c) => (
          <div
            key={c.id}
            className="flex bg-white rounded-lg px-1 shadow-lg/30 items-center text-xs md:text-base lg:text-xl justify-between gap-1 md:gap-2 lg:gap-3"
          >

            {/* Text or Input depending on edit mode */}
            {editId === c.id ? (
              <input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="flex-2 border rounded-full px-3 py-1"
              />
            ) : (
              <span className="flex-2 text-gray-800">
                {c.city}
              </span>
            )}
            {editId === c.id ? (
              <input
                value={editCityArm}
                onChange={(e) => setEditCityArm(e.target.value)}
                className="flex-2 border rounded-full px-3 py-1"
              />
            ) : (
              <span className="flex-2 text-gray-800">
                {c.city_arm}
              </span>
            )}

            {editId === c.id ? (
              <input
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="flex border rounded-full px-3 py-1"
              />
            ) : (
              <span className="flex text-gray-800">
                {c.price}
              </span>
            )}

            {/* Edit / Save */}
            {editId === c.id ? (
              <button
                onClick={() => saveEdit(c.id)}
                className="px-1 py-1 bg-white text-white rounded-lg hover:scale-150 transition"
              >
                💾
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditId(c.id);
                  setEditCity(c.city);
                  setEditCityArm(c.city_arm);
                  setEditPrice(c.price);
                }}
                className="px-3 py-1 bg-white text-white rounded-lg hover:scale-150 transition"
              >
                ✏️
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => deleteCity(c.id)}
              className="px-3 py-1 bg-white text-white rounded-lg hover:rotate-30 transition"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Add new City */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(e);
            setAdd("on");
          }}
          className="bg-green-600 text-white px-2 py-1 md:px-4 md:py-2 text-sm md:text-xl rounded-full hover:bg-green-400"
        >
          + Add
        </button>
        {add && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setAdd(null)}
          >
            <div
              className="bg-white flex rounded-2xl shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-2 text-center mb-7">
                Add new address
              </h2>

              <input
                type="text"
                placeholder="Add new City..."
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full text-sm md:text-xl border rounded-full p-1 md:p-2 mb-2"
              />

              <input
                type="text"
                placeholder="Քաղաքի անունը"
                value={newCityArm}
                onChange={(e) => setNewCityArm(e.target.value)}
                className="w-full text-sm md:text-xl border rounded-full p-1 md:p-2 mb-2"
              />

              <input
                type="number"
                placeholder="Delivery price ..."
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full text-sm md:text-xl border rounded-full p-1 md:p-2"
              />
              <button
                onClick={addCity}
                className="bg-green-600 text-white text-sm md:text-xl px-4 py-1 rounded-full hover:bg-green-400"
              >
                Add
              </button>
              <button
                className="mt-2 px-4 py-1 bg-gray-200 text-sm md:text-xl rounded-full hover:bg-gray-300 hover:bg-red-500"
                onClick={() => setAdd(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}