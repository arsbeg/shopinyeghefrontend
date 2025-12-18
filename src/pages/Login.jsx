import { useState } from "react";
import api from "../api/axios"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useTranslate } from "../utils/useTranslate";

export default function Login() {
  const {login} = useAuth();  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const t = useTranslate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responce = await api.post("/Users/login", { username, password });
      if (responce.data.access_token) {
        //console.log("Login success:", responce.data);
        /*localStorage.setItem("token", responce.data.access_token);
        localStorage.setItem("user", JSON.stringify(responce.data.user));*/
        login(responce.data.user, responce.data.access_token);
        navigate("/");
      } else {
        console.log("wrong username and passwod");
        alert("Wrong username and password")
      }
    } catch (err) {
      setError("Wrong username or password");
    }
  };

  return (
    <div className="flex justify-center items-top bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">{t("login")}</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 cursor-pointer"
        >
          {t("login")}
        </button>
        <p className="text-center text-sm mt-4">
          {t("noAccount")}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            {t("register")}
          </span>
        </p>
      </form>
    </div>
  );
}
