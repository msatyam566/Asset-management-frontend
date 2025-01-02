import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../cards/NotificationProvider";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "STAFF", // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  let token = localStorage.getItem("token");

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/; // Assumes 10-digit mobile numbers
    return mobileRegex.test(mobile) ? "" : "Mobile number must be 10 digits";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return emailRegex.test(email) ? "" : "Invalid email address";
  };

  const validateName = (name) => {
    return name.trim() !== "" ? "" : "Name cannot be empty";
  };

  const validatePassword = (password) => {
    const minLength = 7;
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength)
      return "Password must be at least 7 characters long";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const nameError = validateName(formData.name);
    const mobileError = validateMobile(formData.mobile);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (nameError || emailError || mobileError || passwordError) {
      showNotification(
        nameError || emailError || mobileError || passwordError,
        "error"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop-owner/add",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data) {
        showNotification(response.data.message || "Staff added successfully!","success");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          role: "STAFF", // Reset to default
        });
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          "Failed to add staff. Please try again.",
        "error"
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
        Add Staff
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span
            className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span
            className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={toggleConfirmPasswordVisibility}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="STAFF">Staff</option>
          </select>
        </div>

        <div className="flex justify-between gap-4 mt-3">
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              navigate("/shop-owner/staff");
            }}
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
