import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { API_BASE_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Загружаем слайдеры
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.get("/Carousel/all");
        setSlides(res.data);
      } catch (err) {
        console.error("Error loading carousel:", err);
      }
    };
    fetchSlides();
  }, []);

  // Автоматическая смена слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (slides.length ? (prev + 1) % slides.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[200px] md:h-[300px] lg:h-[450px] overflow-hidden rounded-2xl shadow-lg">
      <AnimatePresence>
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Фон-картинка */}
          <img
            src={`${API_BASE_URL}${slides[current].carousel_image}`}
            alt={slides[current].header_text}
            className="w-full h-full object-cover"
          />

          {/* Затемнение */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Тексты */}
          <div className="absolute inset-0 flex flex-col justify-end pb-12 px-8 md:px-16 text-white">
            <motion.h2
              key={`header-${slides[current].id}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg"
            >
              {slides[current].header_text}
            </motion.h2>
            <motion.p
              key={`footer-${slides[current].id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-lg md:text-2xl font-medium text-gray-200 drop-shadow-md"
            >
              {slides[current].footer_text}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Навигация по точкам */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
