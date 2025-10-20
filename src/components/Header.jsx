import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";
import Navbar from "./Navbar"


export default function Header() {
  const { user, logout } = useUserStore();

  return (
    <header className="bg-white shadow p-4cflex justify-between items-center">
      <Navbar /> 
    </header>
  );
}
