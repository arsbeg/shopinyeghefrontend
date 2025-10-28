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
import BasketPage from "./pages/BasketPage";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <AppLayout>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
            <Route path="/manager" element={<ProtectedRoute role="manager"><Manager /></ProtectedRoute>} />
            <Route path="/courier" element={<ProtectedRoute role="courier"><Courier /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
            <Route path="/store/:id" element={<StorePage />} />
            <Route path="/basket" element={<BasketPage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AppLayout>
  );
}

export default App;
