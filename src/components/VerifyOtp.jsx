import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { AUTH_API } from "../services/apis";
import toast from "react-hot-toast";

const VerifyOtp = ({ email }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await apiConnector("POST", AUTH_API.VERIFY_OTP_API, {
        email,
        otp,
      });

      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <button
        onClick={handleVerify}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default VerifyOtp;
