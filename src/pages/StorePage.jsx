import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { API_BASE_URL } from "../config";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("token");

  const addToBasket = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      await api.post(
        `/orders/add_to_basket/${product.id}/${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Adding to card");
    } catch (err) {
      alert("Error adding to cart");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
      <img
        src={`${API_BASE_URL}${product.image}`}
        alt={product.pr_name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="font-semibold">{product.pr_name}</h3>
      <p className="text-gray-600">{product.price} ֏</p>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={addToBasket}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to cart
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

  if (!store) return <div className="p-8 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{store.st_name}</h1>
        {store.st_image && (
          <img
            src={`${API_BASE_URL}${store.st_image}`}
            alt={store.st_name}
            className="max-h-32 object-cover rounded-xl mb-4 shadow"
          />
        )}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            /*<div
              key={p.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={`${API_BASE_URL}${p.image}`}
                alt={p.pr_name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-gray-800">{p.pr_name}</h3>
                <p className="text-gray-600 text-sm">{p.price} ֏</p>
              </div>
            </div> */
            <ProductCard product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
