import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import AddCategoryModal from "./AddCategoryModal";
// import EditCategoryModal from "./EditCategoryModal";

export default function ProductsTab() {
  const { token, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [expandedStore, setExpandedStore] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState({});
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🏪 Загрузка магазинов менеджера
  const fetchStores = async () => {
    try {
      const res = await api.get(`/Store/all`);
      setStores(res.data.filter(s => s.owner_id == user.id));
    } catch (err) {
      console.error("Error fetching manager stores:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchStores();
  }, [user]);

  // 📂 Загрузка категорий магазина
  const fetchCategories = async (storeId) => {
    try {
      const res = await api.get(`/Category/cat-by-storeid/${storeId}`);
      setCategories((prev) => ({ ...prev, [storeId]: res.data }));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 🧃 Загрузка продуктов категории
  const fetchProducts = async (categoryId) => {
    try {
      const res = await api.get(`/Products/by_category/${categoryId}`);
      setProducts((prev) => ({ ...prev, [categoryId]: res.data }));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // 🗑 Удаление категории
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/Category/${catId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Category deleted");
      // обновить категории текущего магазина
      if (expandedStore) fetchCategories(expandedStore);
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  // 🗑 Удаление продукта
  const handleDeleteProduct = async (prodId, categoryId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/Products/${prodId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product deleted");
      fetchProducts(categoryId);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  const handleAddCategory = (store) => {
    setSelectedStore(store);
    setIsAddCategoryOpen(true);
  };
  
  const handleAddProduct = (category, store) => {
    setSelectedCategory(category);
    setSelectedStore(store)
    setIsAddProductOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Products</h2>

      {stores.map((store) => (
        <div key={store.id} className="mb-6 border rounded-lg p-4 shadow-sm bg-white">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => {
              setExpandedStore(
                expandedStore === store.id ? null : store.id
              );
              if (expandedStore !== store.id) fetchCategories(store.id);
            }}
          >
            <h3 className="text-lg font-bold">{store.st_name}</h3>
            <span className="text-gray-500">
              {expandedStore === store.id ? "▲" : "▼"}
            </span>
          </div>

          {expandedStore === store.id && (
            <div className="mt-3 pl-4 border-l">
              {categories[store.id]?.map((cat) => (
                <div key={cat.id} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {cat.cat_name}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddProduct(cat, store)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        + Add Product
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>

                  {/* Продукты */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {products[cat.id] ? (
                      products[cat.id].map((p) => (
                        <div
                          key={p.id}
                          className="border rounded-lg p-2 shadow hover:shadow-md transition"
                        >
                          <img
                            src={`${API_BASE_URL}${p.image}`}
                            alt={p.pr_name}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="mt-2 text-sm">
                            <div className="font-semibold">{p.pr_name}</div>
                            <div>Stock: {p.pr_quantity}</div>
                            <div>Price: {p.pr_price} ֏</div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, cat.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <button
                        onClick={() => fetchProducts(cat.id)}
                        className="text-blue-600 text-sm underline"
                      >
                        Load products
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Добавление категории */}
              <button
                className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleAddCategory(store.id)}
              >
                + Add Category
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Модалки */}
      {selectedCategory && (
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onAdded={() => fetchProducts(selectedCategory.id)}
          category={selectedCategory}
          store={selectedStore}
        />
      )}

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditProductOpen}
          onClose={() => setIsEditProductOpen(false)}
          onUpdated={() => fetchProducts(selectedProduct.cat_id)}
          product={selectedProduct}
        />
      )}

      {selectedStore && (
        <AddCategoryModal
          isOpen={isAddCategoryOpen}
          onClose={() => setIsAddCategoryOpen(false)}
          onAdded={() => fetchCategories(expandedStore)}
          store={selectedStore}
        />
      )}
    </div>
  );
}
