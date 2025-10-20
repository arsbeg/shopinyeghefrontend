import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getCroppedImg } from "../../utils/getCroppedImg";

Modal.setAppElement("#root");

export default function EditProductModal({ isOpen, onClose, store, onUpdated }) {
  const { token } = useAuth();
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({
    pr_name: "",
    price: "",
    quantity: "",
    description: "",
    image: "",
  });

  // crop state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


  // заполняем форму текущими данными магазина
  useEffect(() => {
    if (product) {
      setForm({
        pr_name: product.pr_name || "",
        price: store.st_name || "",
        quantity: store.itn || "",
        description: store.address || "",
        st_image: "", // пусто, чтобы не отправлять старый URL
      });
    }
  }, [product]);

  // загрузка нового фото
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // после обрезки
  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let base64Image = form.st_image;

      // если выбрано новое фото → обрезаем и кодируем
      if (imageSrc && croppedAreaPixels) {
        base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      }

      // если base64 пустой — бекенд оставит старый URL
      const payload = { ...form, st_image: base64Image };

      await api.put(`/Products/${product.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product");
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
          placeholder="Product Name"
          className="border p-2 rounded w-full"
          value={form.pr_name}
          onChange={(e) => setForm({ ...form, pr_name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="IPrice"
          className="border p-2 rounded w-full"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Quantity"
          className="border p-2 rounded w-full"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

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
              aspect={1 / 1}
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
