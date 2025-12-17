import { useEffect, useState } from "react";
import api from "../api/axios";
import {API_BASE_URL} from "../config"
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import { useLang } from "../context/LanguageContext";
import { tField } from "../utils/tField";
import { useTranslate } from "../utils/useTranslate";

export default function Home() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = useTranslate();

  useEffect(() => {
    api
      .get("/Store/all")
      .then((res) => setStores(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <HeroCarousel />
      <h2 className="text-3xl text-center text-shadow-lg/40 font-bold mb-4 text-gray-800 uppercase">Your City, Your Store — Yeghegnadzor Online!</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            onClick={() => navigate(`/store/${store.id}`)}
          >
            <div className="aspect-[1/1] overflow-hidden">
                <img 
                    src = {new URL(store.st_image,API_BASE_URL).href}
                    alt={store.st_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
            </div>
            <div className="p-4 flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{tField(store, "st_name", lang)}</h3>
                <button className="mt-3 px-4 py-1 bg-gradient-to-b from-sky-300 via-white to-sky-300 text-blue-900 rounded-full hover:bg-blue-600"
                    onClick={(e) => {e.stopPropagation();
                    setSelectedStore(store);
                    }}>
                    {t("details")}
                </button>
            </div>
          </div>
        ))}
      </div>
      {selectedStore && (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedStore(null)} >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-2">{tField(selectedStore, "st_name", lang)}</h2>
                <p className="text-gray-600 mb-2"><strong>🚩: </strong>{tField(selectedStore, "address", lang) || "No address"}</p>
                <p className="text-gray-600 mb-2"><strong>☎: </strong>{selectedStore.phone || "-----"}</p>
                <button
                    className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    onClick={() => setSelectedStore(null)}
                >
                    Close
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
