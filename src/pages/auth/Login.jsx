import React, { useState } from "react";
import { loginUser } from "../../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {

    const data = await loginUser({ email, password });

    localStorage.setItem("accessToken", data.data.accessToken);
    
    toast.success("Login successful 🎉");

    navigate("/");

  } catch (error) {

    toast.error(
      error?.response?.data?.message || "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md"
      >

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          Welcome Back
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}

          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
              <placeholder>
                Head1@wp.com
              </placeholder>
            </label>

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}

          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
              <placeholder>
                123321     
              </placeholder>
            </label>

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Button */}

<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  disabled={loading}
  type="submit"
  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium shadow hover:bg-indigo-700 transition disabled:opacity-50"
>
  {loading ? "Signing in..." : "Login"}
</motion.button>

        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 cursor-pointer hover:underline">
            Register
          </Link>
        </motion.p>

      </motion.div>

    </div>
  );
}

export default Login;