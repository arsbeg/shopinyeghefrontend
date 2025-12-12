import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Addresses({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [add, setAdd] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState("");

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Load all addresses
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Users/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(response.data || []);

      if (response.data.length > 0) {
        const first = response.data[0];

        setSelectedAddress(first.id);

        onSelect &&
          onSelect({
            id: first.id,
            price: first.price,
          });
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Addresses/cities/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCityList(response.data || []);
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    fetchCities();
  }, []);

  // Create new address
  const addAddress = async () => {
    if (!newAddress.trim()) return alert("Enter address");

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/Users/addresses",
        { address: newAddress, city_id: city },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewAddress("");
      await fetchAddresses();
      setAdd(null);
    } catch (err) {
      console.error("Add address error:", err);
    }
  };

  // Delete address
  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/Users/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAddresses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Save edited address
  const saveEdit = async (id) => {
    if (!editValue.trim()) return alert("Enter valid address");

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/Users/address/${id}`,
        { address: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditId(null);
      setEditValue("");
      await fetchAddresses();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // Select address with radio
  const selectAddress = (addr) => {
    setSelectedAddress(addr.id);
    onSelect?.({
      id: addr.id,
      price: addr.price,
    });
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-sky-200 p-4 rounded-xl shadow-md mt-8">
      <h2 className="text-base md:text-xl lg:text-2xl font-semibold mb-4">
        📍 My shipping addresses
      </h2>

      {/* List of addresses */}
      <div className="space-y-3 mb-4">
        {addresses.length === 0 && (
          <p className="text-gray-500">No saved addresses yet</p>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex bg-white rounded-lg px-1 shadow-lg/30 items-center text-xs md:text-base lg:text-xl justify-between gap-1 md:gap-2 lg:gap-3"
          >
            {/* Radio */}
            <input
              type="radio"
              name="address"
              checked={selectedAddress === addr.id}
              onChange={() => selectAddress(addr)}
            />

            {/* Text or Input depending on edit mode */}
            {editId === addr.id ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 border rounded-full px-3 py-1"
              />
            ) : (
              <span className="flex-1 text-gray-800">
                {addr.city}, {addr.address}
              </span>
            )}

            {/* Edit / Save */}
            {editId === addr.id ? (
              <button
                onClick={() => saveEdit(addr.id)}
                className="px-3 py-1 bg-white text-white rounded-lg hover:scale-150 transition"
              >
                💾
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditId(addr.id);
                  setEditValue(addr.address);
                }}
                className="px-3 py-1 bg-white text-white rounded-lg hover:scale-150 transition"
              >
                ✏️
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => deleteAddress(addr.id)}
              className="px-3 py-1 bg-white text-white rounded-lg hover:rotate-30 transition"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Add new address */}
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
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-2 text-center mb-7">
                Add new address
              </h2>
              <p className="text-gray-500 px-2 text-sm md:text-xl">
                Select city
              </p>

              <select
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-full p-1 md:p-2 mb-4 text-sm md:text-xl"
              >
                <option value=""></option>
                {cityList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.city}
                  </option>
                ))}{" "}
                ;
              </select>

              <input
                type="text"
                placeholder="Add new address..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full text-sm md:text-xl border rounded-full p-1 md:p-2"
              />
              <button
                onClick={addAddress}
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
