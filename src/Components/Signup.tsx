import {
  Mail,
  Lock,
  User,
  ChevronDown,
  ALargeSmall,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Signup({ isSignup }: { isSignup: boolean }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const [role, setRole] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        const otpres = await fetch("http://localhost:3000/createotp", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: userInfo.email }),
        });

        const { message, otp, error } = await otpres.json();
        if (error) {
          toast.error(error, { closeButton: true });
          return;
        }
        toast.success(message, { closeButton: true });

        return navigate("/verifyotp", {
          state: {
            otp,
            name: userInfo.name,
            email: userInfo.email,
            password: userInfo.password,
            role,
          },
        });
      }

      const res = await fetch(`http://localhost:3000/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          password: userInfo.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(data.message);
      setUserInfo({ name: "", email: "", password: "" });
      setRole("");

      if (data.role === "admin") {
        navigate("/admin/inventory", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isSignup ? "Join us and start your hunger game" : "Welcome back!"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {isSignup && (
              <>
                <div className="relative">
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <ALargeSmall
                    className="absolute top-3 left-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pl-10 bg-gray-700 bg-opacity-30"
                    required
                  />
                </div>
                <div className="relative">
                  <label htmlFor="role" className="sr-only">
                    Role
                  </label>
                  <User
                    className="absolute top-3 left-3 text-gray-400"
                    size={18}
                  />
                  <ChevronDown
                    className="absolute top-3 right-3 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    id="role"
                    value={role}
                    onChange={handleRoleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pl-10 pr-10 bg-gray-700 bg-opacity-30"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                placeholder="Email address"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pl-10 bg-gray-700 bg-opacity-30"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pl-10 bg-gray-700 bg-opacity-30"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {!isSignup && (
              <p className="text-white m-0 text-right">
                Forgot your password?{" "}
                {
                  <Link className="text-blue-500 underline" to="/forgotpass">
                    Want help
                  </Link>
                }
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : isSignup ? "Sign up" : "Sign in"}
            </button>
            <div className="w-full text-white my-4 text-center">
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
              <Link
                className="text-blue-600 underline"
                to={`/auth${isSignup ? "?signin" : ""}`}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
