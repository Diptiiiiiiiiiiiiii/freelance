import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { AUTH_API } from "../services/apis";
import VerifyOtp from "../components/VerifyOtp";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [step, setStep] = useState("REGISTER");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await apiConnector("POST", AUTH_API.REGISTER_API, data);
      setEmail(data.email);
      setStep("VERIFY");
      toast.success("OTP sent to your email.");
    } catch (err) {
      toast.error(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          {step === "REGISTER" ? "Create Account" : "Verify OTP"}
        </h2>

        {step === "REGISTER" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
              className="w-full bg-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "Enter a valid email",
                },
                validate: (value) => {
                  const blocked = ["xyz.com", "tempmail.com", "mailinator.com"];
                  if (blocked.includes(value.split("@")[1])) {
                    return "Enter a valid email domain";
                  }
                  return true;
                },
              })}
              className="w-full bg-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full bg-gray-100 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
                className="w-full bg-gray-100 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full bg-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select Role</option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white text-lg font-medium rounded-lg transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            {/* Already have account */}
            <p className="text-sm text-center text-gray-600 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 hover:underline">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <VerifyOtp email={email} />
        )}
      </div>
    </div>
  );
};

export default Register;
