import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center items-center px-3 sm:px-4 ">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full mt-30 max-w-sm sm:max-w-md">
        {/* Logo */}
        <h1 className="text-3xl font-semibold text-emerald-600 text-center mb-2">
          Smart Dining
        </h1>

        {/* Title */}
        <p className="text-gray-500 text-center text-sm mt-1">
          Welcome back! Please enter your details.
        </p>

        {/* Email Input */}
        <div className="mt-6">
          <label className="text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
        </div>

        {/* Password Input */}
        <div className="mt-4">
          <label className="text-gray-700 font-medium">Password</label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />

            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg mt-6 font-semibold transition">
          Sign In
        </button>

        {/* Extra Links */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-emerald-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
