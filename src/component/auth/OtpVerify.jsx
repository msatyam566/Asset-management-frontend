import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../cards/NotificationProvider";

const OtpVerify = ({onLogin}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); 
  const navigate = useNavigate();
  const { showNotification } = useNotification();


  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = async () => {
    if (otp.trim() === "") {
      showNotification("Please enter the OTP.","error"); 
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        { email, otp }
      );

      const { accessToken, payload } = response.data; // Extracting token and payload

       // Save token to localStorage
       localStorage.setItem("token", accessToken);

       // Call the onLogin callback
       onLogin(payload.role);

      // Show success notification
       showNotification("Logged in successfully ", "success");


       // Redirect based on the user's role
       setTimeout(() => {

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

      }, 2000); // Delay for 2 seconds


    } catch (error) {
      console.error(error.response?.data.error);
      showNotification(
        error.response?.data?.error ||
          "Failed to verify otp. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoadingResend(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/otp",{
        email:email
      });
      if (response.status === 200) {
        showNotification(response.data.message,"success");
      } else {
        showNotification(response.data.message || "Failed to send OTP.","error");
      }
    } catch (error) {
      console.error(error.response?.data?.data || error.message);
      showNotification(
        error.response?.data?.message ||
          "Failed to send otp. Please try again.",
        "error"
      );
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
            disabled={loading || loadingResend}
          />
        </div>
        <button
          onClick={handleVerify}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
         >
          {loading ? "Verifying..." : "Verify"}
        </button>


        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            className="text-blue-500 hover:underline"
            disabled={loading || loadingResend}
          >
            {loadingResend ? "Resending OTP..." : "Resend OTP"}
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
