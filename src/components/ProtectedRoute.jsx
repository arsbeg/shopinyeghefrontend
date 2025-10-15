import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" />;

  const user = JSON.parse(userData);
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  
  return children;
}
