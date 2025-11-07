import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Users/register", { first_name, last_name, username, password, email, birthday });
      navigate("/login");
    } catch (err) {
      setError("Ошибка при регистрации");
    }
  };

  return (
    <div className="flex justify-center items-top bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder="First Name"
          value={first_name}
          onChange={(e) => setFirst_name(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={last_name}
          onChange={(e) => setLast_name(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="text"
          placeholder="yyyy-mm-dd"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}
