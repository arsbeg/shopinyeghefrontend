import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Manager from "./pages/Manager";
import Courier from "./pages/Courier";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute"
import StorePage from "./pages/StorePage";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/courier" element={<Courier />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/store/:id" element={<StorePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
