import { useState } from "react";
import api from "../api/axios"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {login} = useAuth();  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const responce = await api.post("/Users/login", { username, password });
      if (responce.data.access_token) {
        console.log("Login success:", responce.data);
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
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
