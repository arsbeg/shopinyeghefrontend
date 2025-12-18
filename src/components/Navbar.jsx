import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LanguageContext";
import { useTranslate } from "../utils/useTranslate";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count, fetchCartCount } = useCart();
  const { lang, changeLang } = useLang();
  const t = useTranslate();
  fetchCartCount();

  const handleProfileClick = () => {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "manager") navigate("/manager");
    else if (user.role === "courier") navigate("/courier");
    else navigate("/profile");
  };

  return (
    <nav className="bg-gradient-to-b from-sky-300 via-white to-sky-300 text-gray-900 font-semibold p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link
          to="/"
          className="font-bold text-gray-900 text-[9px] md:text-sm lg:text-lg text-shadow-lg/20"
        >
          🏪 SHOPINYEGHEGNADZOR
        </Link>
      </div>

      <div className="flex gap-0 md:gap-2 lg:gap-3 items-center text-[9px] md:text-sm lg:text-lg">
        <div className="flex items-center gap-1 mr-5">
          <button
            onClick={() => changeLang("en")}
            className={`rounded-full
              ${lang === "en" ? "text-red-600" : "text-gray-400"}`}
          >
            ENG
          </button>
                /
          <button
            onClick={() => changeLang("hy")}
            className={`rounded-full
              ${lang === "hy" ? "text-red-600" : "text-gray-400"}`}
          >
            ՀԱՅ
          </button>
        </div>
        {/* Кнопка корзины */}
        {user && (
          <div onClick={() => navigate("/basket")} className="relative px-3">
            <ShoppingCart className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 cursor-pointer" />

            {count > 0 && (
              <span
                className="
                absolute -top-2 right-1
                bg-red-600 text-white text-[9px] md:text-sm
                w-3.5 h-3.5 md:h-6 md:w-6 flex items-center justify-center
                rounded-full
              "
              >
                {count}
              </span>
            )}
          </div>
          /*<button
            onClick={() => navigate("/basket")}
            className="px-1 py-1 md:py-2 lg:py-2 rounded-full cursor-pointer"
          >
            🛒 Cart
          </button>*/
        )}

        {/* Если нет авторизации */}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="px-1 py-1 md:py-2 lg:py-2 rounded-full cursor-pointer"
          >
            🔓{t("login")}
          </button>
        )}

        {/* Если есть авторизация */}
        {user && (
          <>
            <button
              onClick={handleProfileClick}
              className="px-1 py-1 md:py-2 lg:py-2 rounded-full cursor-pointer"
            >
              👤{user.username}
            </button>
            <button
              onClick={logout}
              className="px-1 py-1 md:py-2 lg:py-2 rounded-full cursor-pointer text-red-500"
            >
              🔒{t("logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
