import React, { useState, FormEvent } from "react";
import { Loader } from "./Loader";
import { useAlert } from "../context/AlertContext";
import axios from "axios";
import { domain, endpoints } from "../api/api";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let response = await axios.post(domain + endpoints.login, {
        ...formData,
      });

      console.log(response);
      if (response.data.success) {
        let data = {
          ...response.data.result,
          token: response.data.token,
        };
        localStorage.setItem("userToken", JSON.stringify(data));
        navigate("/products");
        return;
      } else {
        showAlert({
          title: response.data.message,
          message: response.data.message,
          type: "error",
        });
      }
    } catch (error) {
      showAlert({
        title: "Invalid Credentials",
        message: "Authentication Failed",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <>
      {isSubmitting && <Loader />}

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Background Image */}
            <div className="md:w-1/2 bg-gradient-to-b from-gray-700 to-gray-900 p-12">
              <div className="h-full relative">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full opacity-20"
                >
                  <path
                    d="M0 70 C20 60, 40 80, 60 70 S80 60, 100 70 L100 100 L0 100 Z"
                    fill="currentColor"
                    className="text-gray-600"
                  />
                  <path
                    d="M0 85 C30 75, 50 95, 70 85 S90 75, 100 85 L100 100 L0 100 Z"
                    fill="currentColor"
                    className="text-gray-700"
                  />
                </svg>
              </div>
            </div>

            {/* Right side - Login Form */}
            <div className="md:w-1/2 py-12 px-8">
              <h2 className="text-3xl font-bold mb-2">Log In to Admin Panel</h2>
              <p className="text-gray-500 mb-8">
                Enter your email id and password below
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EMAIL ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email id"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-black text-white py-3 rounded-lg transition-colors ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>

                <p className="text-center text-gray-500">
                  Don't have an account?{" "}
                  <a href="/register" className="text-black hover:underline">
                    Register
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
