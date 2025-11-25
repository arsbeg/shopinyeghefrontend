import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getCroppedImg } from "../../utils/getCroppedImg";

Modal.setAppElement("#root");

export default function AddStoreModal({ isOpen, onClose, onAdded }) {
  const { token } = useAuth();
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({
    owner_id: "",
    st_name: "",
    itn: "",
    address: "",
    phone: "",
    st_image: "",
  });

  // crop state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await api.get("/Users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const onlyManagers = res.data.filter(
          (u) => u.us_role === "manager" || u.us_role === 3
        );
        setManagers(onlyManagers);
      } catch (err) {
        console.error("Error loading managers:", err);
      }
    };
    if (isOpen) fetchManagers();
  }, [isOpen, token]);

  // загрузка фото
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // при завершении обрезки
  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let base64Image = form.st_image;

      if (imageSrc && croppedAreaPixels) {
        base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      }

      const payload = { ...form, st_image: base64Image };
      await api.post("/Store/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Store added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error("Error adding store:", err);
      alert("Failed to add store");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Store</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Store Name"
          className="border p-2 rounded w-full"
          value={form.st_name}
          onChange={(e) => setForm({ ...form, st_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="ITN"
          className="border p-2 rounded w-full"
          value={form.itn}
          onChange={(e) => setForm({ ...form, itn: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-2 rounded w-full"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          className="border p-2 rounded w-full"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <select
          className="border p-2 rounded w-full"
          value={form.owner_id}
          onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
          required
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.username}
            </option>
          ))}
        </select>

        <div>
          <label className="block font-medium mb-1">Store Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {imageSrc && (
          <div className="relative w-full h-64 bg-gray-200 mt-3 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1} // ✅ теперь правильное соотношение 4:3
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

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
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}
