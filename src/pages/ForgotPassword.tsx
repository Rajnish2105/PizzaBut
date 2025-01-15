import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [isSubmmitted, setIsSubmitted] = useState<boolean>(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("email before", email);

    try {
      const res = await fetch("http://localhost:3000/verifyuser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        toast.error("something went wrong!", { closeButton: true });
        return;
      }
      const { verified } = await res.json();

      if (verified) {
        setIsSubmitted(true);
      } else {
        toast.error("No Such user exist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server down", { closeButton: true });
    }
  }

  if (isSubmmitted) {
    return (
      <main className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Password Reset Email Sent! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            We have sent your new password to your email. Please check your
            inbox and follow the instructions.
          </p>
          <Link
            to="/auth?signin"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Go Back to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Just to verify Please write your email!
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  value={email}
                  required
                  placeholder="example@gmail.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                Request Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
