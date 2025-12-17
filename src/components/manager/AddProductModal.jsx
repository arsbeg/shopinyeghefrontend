import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getCroppedImg } from "../../utils/getCroppedImg";

Modal.setAppElement("#root");

export default function AddProductModal({ isOpen, onClose, onAdded, category, store }) {
  const { token, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    pr_name: "",
    pr_name_arm: "",
    price: "",
    quantity: "",
    description: "",
    description_arm: "",
    category_id: category?.id,
    store_id: store?.id,
    image: "",
  });


  // crop state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


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
      let base64Image = form.image;

      if (imageSrc && croppedAreaPixels) {
        base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      }

      const payload = { ...form, image: base64Image };
      await api.post("/Products/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

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
          type="text"
          placeholder="Ապրանքի Անվանումը"
          className="border p-2 rounded w-full"
          value={form.pr_name_arm}
          onChange={(e) => setForm({ ...form, pr_name_arm: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded w-full"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
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
        <input
          type="text"
          placeholder="Նկարագրություն"
          className="border p-2 rounded w-full"
          value={form.description_arm}
          onChange={(e) => setForm({ ...form, description_arm: e.target.value })}
          required
        />

        <p>
            <span className="font-bold">Category:  </span>
            <span>{category?.cat_name}</span>
        </p>

        <p>
            <span className="font-bold">Store:  </span>
            <span>{store?.st_name}</span>
        </p>

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
