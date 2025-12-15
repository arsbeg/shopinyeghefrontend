import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const navigate = useNavigate();
  const {user, logout} = useAuth();

  const handleProfileClick = () => {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "manager") navigate("/manager");
    else if (user.role === "courier") navigate("/courier");
    else navigate("/profile")
  };

  return (
    <nav className="bg-gradient-to-b from-sky-300 via-white to-sky-300 text-gray-900 font-semibold p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold text-gray-900 text-[9px] md:text-sm lg:text-lg text-shadow-lg/20">🏪 SHOPINYEGHEGNADZOR</Link>
      </div>

      <div className="flex gap-0 md:gap-2 lg:gap-3 items-center text-[9px] md:text-sm lg:text-lg">
        {/* Кнопка корзины */}
        {user && (
          <button
            onClick={() => navigate("/basket")}
            className="px-1 py-1 md:py-2 lg:py-2 rounded-full cursor-pointer"
          >
            🛒 Cart
          </button>
        )}

        {/* Если нет авторизации */}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="px-1 py-1 md:py-2 lg:py-2 rounded-full cursor-pointer"
          >
            🔓Login
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
              🔒Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
