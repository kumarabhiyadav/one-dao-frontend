import axios from "axios";
import { useState } from "react";
import { domain, endpoints } from "../api/api";
import { Loader } from "./Loader";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // console.log('Form submitted:', formData);

    setLoading(true);

    let response = await axios.post(domain + endpoints.sendotp, {
      ...formData,
      name: "",
    });
    console.log(response);
    setLoading(false);
    if (response.statusText === "OK" && response.data) {
     
      navigate("/verify-email",{state:{formData}});
    } else if (response.status == 200) {
    
      showAlert({
        message: response.data.message,
        title: response.data.success
          ? "OTP SEND TO EMAIL"
          : "Failed to send OTP",
        type: "success",
      });
    }else{
        showAlert({
            message: response.data.message,
            title: response.data.success
              ? "OTP SEND TO EMAIL"
              : "Failed to send OTP",
            type: "success",
          });
    }
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {isLoading && <Loader />}
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

            {/* Right side - Form */}
            <div className="md:w-1/2 py-12 px-8">
              <h2 className="text-3xl font-bold mb-2">
                Register to Admin Panel
              </h2>
              <p className="text-gray-500 mb-8">
                Enter your phone number and password below
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email id"
                    required
                  />
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your confirm password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Register
                </button>

                <p className="text-center text-gray-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-black hover:underline">
                    Login
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

export default RegisterPage;
