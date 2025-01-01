import { useState } from "react";
import axios from "axios";
import { useNotification } from "../cards/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // React Router's navigation hook
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      if (response.status === 200) {
        showNotification(response.data.message, "success");
        navigate(`/verification?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      console.error(error.response?.data?.data || error.message);
      showNotification(
        error.response?.data?.message ||
          "Failed to send otp. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
  <label
    htmlFor="password"
    className="block text-sm font-medium text-gray-600 mb-2"
  >
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      disabled={loading}
      required
      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <span
      className="absolute right-3 top-2 text-gray-500 cursor-pointer hover:text-gray-700"
      onClick={togglePasswordVisibility}
    >
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </span>
  </div>
</div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <div className="flex justify-between items-center mt-4">
          <a href="/register" className="text-sm text-blue-500 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
