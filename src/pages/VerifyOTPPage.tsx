import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import axios from "axios";
import { domain, endpoints } from "../api/api";


const VerifyEmail: React.FC = () => {
  const [, setLoading] = useState(false);
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index: number, value: string): void => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      index > 0 &&
      otp[index] === "" &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const otpString = otp.join("");

    try {
      if (data) {
        setLoading(true);

        let response = await axios.post(domain + endpoints.signup, {
          ...data.formData,
          otp: otpString,
          name: "",
        });
        setLoading(false);
        console.log(response);
        if (response.data.success) {
          showAlert({
            message: "Welcome",
            title: "Your Account Has been created",
            type: "success",
          });
          navigate("/login");

          return;
        } else {
          showAlert({
            message: response.data.message,
            title: "",
            type: "error",
          });
        }
      }
    } catch (error:any) {
        console.log(error.response.data.message);
      showAlert({
        title: "",
        message: error.response.data.message,
        type: "error",
      });
      navigate("/login");
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
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

          {/* Right side - Verification Form */}
          <div className="md:w-1/2 py-12 px-8">
            <h2 className="text-3xl font-bold mb-2">Verify your email</h2>
            <p className="text-gray-500 mb-8">
              Enter the OTP from your register email id
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={handlePaste}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
