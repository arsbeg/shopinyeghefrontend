import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Register() {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Users/register", {
        first_name,
        last_name,
        username,
        password,
        email,
        birthday,
        gender,
        phone_number,
      });
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
        {/*<input
          type="date"
          placeholder="yyyy-mm-dd"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />*/}
        <div className="p-0 flex flex-col-2 justify-between mb-4">
          <p className="text-gray-500 p-2">Birthday</p>
          <DatePicker
            selected={birthday}
            onChange={(date) => setBirthday(date)}
            className="border p-2 rounded-lg w-full text-right"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            dateFormat="dd/MM/yyy"
          />
        </div>
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
        <select
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          placeholder="+37400000000"
          value={phone_number}
          onChange={(e) => setPhone_number(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
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
