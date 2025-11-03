import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { getCroppedImg } from "../utils/getCroppedImg";

Modal.setAppElement("#root");

export default function ChangeAvatar({ isOpen, onClose, onUpdated }) {
  const { token } = useAuth();
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // выбор фото
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // предпросмотр
  const handlePreview = async () => {
    if (imageSrc && croppedAreaPixels) {
      const base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPreview(base64Image);
    }
  };

  // сохранение
  const handleSave = async () => {
    try {
      setLoading(true);
      let base64Image = preview;
      if (!base64Image && imageSrc && croppedAreaPixels) {
        base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);
      }

      await api.put(
        "/Users/avatar_change",
        { user_image: base64Image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Avatar updated successfully!");
      onUpdated && onUpdated();
      onClose();
    } catch (err) {
      console.error("Error changing avatar:", err);
      alert("❌ Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg mx-auto mt-20 relative overflow-hidden"
          overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-5 text-center">
              Change Avatar
            </h2>

            {!imageSrc ? (
              <div className="text-center">
                <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="relative w-full h-64 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setImageSrc(null)}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full cursor-pointer"
                    disabled={loading}
                  >
                    ✏️Choose Another
                  </button>
                  <button
                    onClick={handlePreview}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full cursor-pointer"
                    disabled={loading}
                  >
                    Preview
                  </button>
                </div>
              </>
            )}

            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center"
              >
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
                />
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-full cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "💾Saving..." : "💾Save Avatar"}
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
