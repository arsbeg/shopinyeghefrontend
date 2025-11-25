import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getCroppedImg } from "../../utils/getCroppedImg";

Modal.setAppElement("#root");

export default function AddItemModal({ isOpen, onClose, onAdded }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    img_name: "",
    header_text: "",
    footer_text: "",
    carousel_image: "",
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
      let base64Image = form.st_image;

      if (imageSrc && croppedAreaPixels) {
        base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      }

      const payload = { ...form, carousel_image: base64Image };
      await api.post("/Carousel/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Image added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error("Error adding image:", err);
      alert("Failed to add image");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto mx-auto mt-20 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Image</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Image Name"
          className="border p-2 rounded w-full"
          value={form.img_name}
          onChange={(e) => setForm({ ...form, img_name: e.target.value })}
          required
        />
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

        <div>
          <label className="block font-medium mb-1">Carousel Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {imageSrc && (
          <div className="relative w-full h-64 bg-gray-200 mt-3 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 6} // ✅соотношение 16:9
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
