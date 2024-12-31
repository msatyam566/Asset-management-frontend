import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800  text-white shadow-md w-full flex justify-between items-center px-6 py-3">
      {/* Logo or Title */}
      <h2 className="text-2xl font-bold text-center">
        <span className="block md:hidden">Asset Management</span>
        <span className="hidden md:block">Asset Management</span>

      </h2>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
      >
        <FiLogOut className="text-lg" />
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
