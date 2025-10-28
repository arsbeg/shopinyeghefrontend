import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getCroppedImg } from "../../utils/getCroppedImg";

Modal.setAppElement("#root");

export default function EditItemModal({ isOpen, onClose, item, onUpdated }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    header_text: "",
    footer_text: "",
  });

  // crop state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


  // заполняем форму текущими данными магазина
  useEffect(() => {
    if (item) {
      setForm({
        header_text: item.header_text || "",
        footer_text: item.footer_text || "",
      });
    }
  }, [item]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const payload = { ...form };

      await api.put(`/Store/${store.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Info updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating information:", err);
      alert("Failed to update information");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Store</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Header Text"
          className="border p-2 rounded w-full"
          value={form.header_text}
          onChange={(e) => setForm({ ...form, header_text: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Footer Text"
          className="border p-2 rounded w-full"
          value={form.footer_text}
          onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
          required
        />
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
