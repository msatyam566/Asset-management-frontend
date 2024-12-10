import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ErrorCard from "../cards/ErrorCard";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = async () => {
    if (otp.trim() === "") {
      alert("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        { email, otp }
      );
      if (response.data) {
        alert("OTP verified successfully!");
        navigate("/login"); // Navigate to the login page
      } else {
        setErrorMessage(response.data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while verifying OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/otp");
      if (response.data) {
        alert("OTP sent successfully!");
      } else {
        setErrorMessage(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while resending OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ErrorCard
        message={errorMessage}
        onClose={() => setErrorMessage("")} 
        position="top-right"
      />
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please enter the OTP sent to your registered email.
        </p>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleVerify}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            {loading ? "Resending OTP..." : "Resend OTP"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
