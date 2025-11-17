import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Addresses({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState("");

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
        setSelectedAddress(response.data[0].id);
        onSelect && onSelect(response.data[0].id);
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Create new address
  const addAddress = async () => {
    if (!newAddress.trim()) return alert("Enter address");

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/Users/addresses",
        { address: newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewAddress("");
      await fetchAddresses();
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
  const selectAddress = (id) => {
    setSelectedAddress(id);
    onSelect && onSelect(id);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">📍 Shipping Address</h2>

      {/* List of addresses */}
      <div className="space-y-3 mb-4">
        {addresses.length === 0 && (
          <p className="text-gray-500">No saved addresses yet</p>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-center justify-between gap-3"
          >
            {/* Radio */}
            <input
              type="radio"
              name="address"
              checked={selectedAddress === addr.id}
              onChange={() => selectAddress(addr.id)}
            />

            {/* Text or Input depending on edit mode */}
            {editId === addr.id ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-1"
              />
            ) : (
              <span className="flex-1 text-gray-800">{addr.address}</span>
            )}

            {/* Edit / Save */}
            {editId === addr.id ? (
              <button
                onClick={() => saveEdit(addr.id)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditId(addr.id);
                  setEditValue(addr.address);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => deleteAddress(addr.id)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add new address */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add new address..."
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={addAddress}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-400"
        >
          Add
        </button>
      </div>
    </div>
  );
}
