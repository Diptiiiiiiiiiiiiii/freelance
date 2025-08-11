import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import { apiConnector } from "../services/apiConnector";
import { AUTH_API } from "../services/apis";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";   // 👈 icons

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await apiConnector("POST", AUTH_API.LOGIN_API, data);

      dispatch(loginSuccess({ user: res.user, token: res.token }));
      toast.success("Logged in successfully!");

      navigate(res.user?.role === "freelancer" ? "/dashboard" : "/");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
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
                  if (blocked.includes(value.split("@")[1]))
                    return "Enter a valid email domain";
                  return true;
                },
              })}
              className="w-full bg-gray-100 focus:bg-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-gray-100 focus:bg-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error */}
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg transition text-lg font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
