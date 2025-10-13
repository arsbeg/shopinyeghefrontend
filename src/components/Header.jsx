import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

export default function Header() {
  const { user, logout } = useUserStore();

  return (
    <header className="bg-white shadow p-4cflex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        SHOPINYEGHEGNADZOR
      </Link>

      <nav className="flex gap-4 text-gray-700">
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            {user.role === "manager" && <Link to="/manager">Manager</Link>}
            {user.role === "courier" && <Link to="/courier">Courier</Link>}
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
