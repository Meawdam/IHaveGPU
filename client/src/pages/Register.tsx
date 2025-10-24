import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSession } from "../components/utility/useSession";

type RegisterForm = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useSession();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/register",
        {
          username: data.username,
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      Swal.fire({
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/login");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-80 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-2xl p-10 w-80 flex flex-col items-center gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.]).+$/,
                  message:
                    "Password must contain 1 uppercase, 1 number, and 1 special character",
                },
              })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.067.162-2.095.463-3.068M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
          <div className="relative w-full">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Password again"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded"
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.067.162-2.095.463-3.068M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
