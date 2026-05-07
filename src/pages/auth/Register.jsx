import React from "react";
import { useState } from "react";
import { registerUser } from "../../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {

      const data = await registerUser({ email, username, password });
      // console.log("Registration successful:", data);
      //   localStorage.setItem("accessToken", data.data.accessToken);
        toast.success("Registration successful 🎉");
        navigate("/login");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }

    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">

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
          Create an Account
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
            <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                type="submit"
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium shadow hover:bg-green-700 transition disabled:opacity-50"
            >
                {loading ? "Signing up..." : "Register"}
            </motion.button>

                    <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 cursor-pointer hover:underline">
            Log in
          </Link>
        </motion.p>
        </form>
      </motion.div>
    </div>
    )

}

export default Register;