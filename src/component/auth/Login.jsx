import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorCard from "../cards/ErrorCard";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // React Router's navigation hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const { accessToken, payload } = response.data; // Extracting token and payload

      // Save token to localStorage
      localStorage.setItem("token", accessToken);

      // Call the onLogin callback
      onLogin(payload.role);

      // Redirect based on the user's role
      const { role } = payload;
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "SHOPOWNER") {
        navigate("/shop-owner");
      } else if (role === "STAFF") {
        navigate("/staff");
      } else {
        console.error("Unknown role:", role);
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
    
            if (status >= 400 && status < 500) {
                if (status === 403) {
                    setErrorMessage('Account not verified. OTP is sent to your registered email.');
                    try {
                        await axios.post('http://localhost:5000/api/auth/otp', { email: formData.email });
                        navigate(`/verification?email=${encodeURIComponent(formData.email )}`);
                      } catch (error) {
                        if(error){
                            setErrorMessage("Server error")
                        }
                        setErrorMessage('Failed to send OTP. Please try again.');
                    }
                } else {
                    setErrorMessage(error.response?.data?.message || 'Client error occurred. Please check your input.');
                }
            } else if (status >= 500 && status <= 599) {
                setErrorMessage('Server error occurred. Please try again later.');
            } else {
                setErrorMessage('Unexpected error occurred. Please try again.');
            }
        } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    }
    
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ErrorCard message={errorMessage}onClose={() => setErrorMessage("")} // Clear the error message
position="top-right" />

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
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
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
