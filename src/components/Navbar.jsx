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
    <nav className="bg-gradient-to-b from-sky-50 to-sky-200 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold text-gray-900 text-xl text-shadow-lg/20">🏪 SHOPINYEGHEGNADZOR</Link>
      </div>

      <div className="flex gap-4 items-center">
        {/* Кнопка корзины */}
        {user && (
          <button
            onClick={() => navigate("/basket")}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full cursor-pointer"
          >
            🛒 Cart
          </button>
        )}

        {/* Если нет авторизации */}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full cursor-pointer"
          >
            Login
          </button>
        )}

        {/* Если есть авторизация */}
        {user && (
          <>
            <button
              onClick={handleProfileClick}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full cursor-pointer"
            >
              👤{user.username}
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
