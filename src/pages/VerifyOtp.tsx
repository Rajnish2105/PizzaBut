import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate(); // Add this
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const user = location.state;
  if (!user) {
    return (
      <p>Error: No signup data found. Please go back to the signup page.</p>
    );
  }

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); // Add this
    setIsVerifying(true);
    try {
      if (otp.join("") === user.otp) {
        // Fix comparison
        const res = await fetch(
          "https://pizzabut-be.rajnishchahar.tech/signup",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              password: user.password,
              role: user.role,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Server Error!");
        }

        toast.success(data.message, { closeButton: true });

        // Better role-based navigation
        if (data.user && data.user.role) {
          switch (data.user.role.toLowerCase()) {
            case "admin":
              navigate("/admin/inventory", { replace: true });
              break;
            case "user":
              navigate("/user/dashboard", { replace: true });
              break;
            default:
              console.warn("Unknown user role:", data.user.role);
              navigate("/", { replace: true });
          }
        } else {
          console.error("No role information in response");
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error instanceof Error ? error.message : "Verification failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Account
          </h2>
          <p className="text-gray-600">Enter the code sent to your email</p>
        </div>
        <div className="flex justify-center mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-2xl font-bold mx-1 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || isVerifying}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Verifying
            </>
          ) : (
            <>
              Verify
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
