import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { API_BASE_URL } from "../config";
import HeroCarousel from "../components/HeroCarousel";
import WeatherWidget from "../components/WhetherWidget";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("token");
  console.log({token});

  const addToBasket = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      await api.post(
        `/Orders/add_to_basket/${product.id}/${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Adding to card");
    } catch (err) {
      alert("Error adding to cart or session time out");
      console.error(err);
      window.location.href = "/login";
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-sky-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center text-center relative group max-w-80">

  {/* Фото */}
  <div className="relative max-w-40 max-h-40 mb-5">
    <img
      src={`${API_BASE_URL}${product.image}`}
      alt={product.pr_name}
      className="w-full h-full object-cover rotate-25 hover:rotate-0 rounded-xl shadow-lg/50 group-hover:scale-105 transition-transform duration-300"
    />
    {/* Лейбл скидки / новинки (пример) */}
    {product.isNew && (
      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
        NEW
      </span>
    )}
  </div>

  {/* Название и цена */}
  <h3 className="font-semibold text-lg text-gray-800 truncate max-w-[160px]">
    {product.pr_name}
  </h3>
  <p className="text-green-700 font-bold mt-1 text-lg">
    {product.price.toLocaleString()} ֏
  </p>

  {/* Количество */}
  <div className="flex items-center justify-center gap-3 mt-3">
    <button
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-300 rounded-full text-lg font-bold transition"
    >
      −
    </button>
    <span className="text-lg font-medium w-6 text-center">{quantity}</span>
    <button
      onClick={() => setQuantity(quantity + 1)}
      className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-300 rounded-full text-lg font-bold transition"
    >
      +
    </button>
  </div>

  {/* Кнопка */}
  <button
    onClick={addToBasket}
    className="mt-4 w-35 bg-blue-600 text-white py-2.5 rounded-full font-semibold hover:bg-blue-700 active:scale-95 transition-transform duration-150"
  >
    🛒 Add to Cart
  </button>

</div>

  );
}



export default function StorePage() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  

  // Загружаем данные магазина и категории
  useEffect(() => {
    api.get(`/Store/${id}`)
      .then(res => setStore(res.data))
      .catch(err => console.error("Ошибка при загрузке магазина:", err));

    api.get(`/Category/cat-by-storeid/${id}`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Ошибка при загрузке категорий:", err));

    // Загружаем все продукты этого магазина (по умолчанию)
    loadProducts("all");
  }, [id]);

  // Загрузка товаров (в зависимости от категории)
  const loadProducts = async (category) => {
    setLoading(true);
    try {
      let response;
      if (category === "all") {
        response = await api.get(`/Products/all`);
      } else {
        response = await api.get(`/Products/by_category/${category}`);
      }
      // Можно отфильтровать по store_id если backend отдаёт все товары
      const filtered = response.data.filter(p => p.store_id == id);
      setProducts(filtered);
    } catch (err) {
      console.error("Ошибка при загрузке продуктов:", err);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик клика по категории
  const handleCategoryClick = (cat_id) => {
    setSelectedCategory(cat_id);
    loadProducts(cat_id);
  };

  if (!store) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-2 min-h-screen bg-gray-50">
      <div className="grid grid-flow-col grid-rows-1 pb-5">
        <div className="col-span-1 row-span-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{store.st_name}</h1>
          {store.st_image && (
          <img
            src={`${API_BASE_URL}${store.st_image}`}
            alt={store.st_name}
            className="relative h-[60px] md:h-[80px] lg:h-[150px] object-cover rounded-xl mb-4 shadow-xl"
          />
          )}
          <WeatherWidget />
        </div>
        <div className="row-span-1 col-span-40"><HeroCarousel /></div>
      </div>

      {/* Категории */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => handleCategoryClick("all")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat.id ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.cat_name}
          </button>
        ))}
      </div>

      {/* Товары */}
      {loading ? (
        <div className="text-center text-gray-500">Loading products ...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">No products</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
