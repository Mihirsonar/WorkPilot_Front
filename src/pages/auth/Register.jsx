import React, { useState } from "react";
import { registerUser, loginUser } from "../../services/auth.service.js";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  User2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  FolderKanban,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser({
        email,
        username,
        password,
      });

      // If backend register returned an accessToken, store it directly
      const token = res?.data?.accessToken || res?.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        // Otherwise, auto-login so the user gets accessToken and directly enters Home/Dashboard
        try {
          const loginRes = await loginUser({ email, password });
          const loginToken =
            loginRes?.data?.accessToken || loginRes?.accessToken;
          if (loginToken) {
            localStorage.setItem("accessToken", loginToken);
          }
        } catch (loginErr) {
          console.warn("Auto login after register:", loginErr);
        }
      }

      toast.success("Account created successfully 🎉");
      // Direct navigation to home page as requested
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4 sm:p-6 lg:overflow-hidden select-none">
      {/* CARD CONTAINER - SINGLE WINDOW FIT */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT SHOWCASE PANEL (Matching screenshot) */}
        <div className="lg:col-span-5 bg-[#f8f9fb] border-r border-gray-200/70 p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle accent blur */}
          <div className="absolute -top-12 -left-12 h-44 w-44 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />

          {/* Top: Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-sm">
                <FolderKanban size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                  WorkPilot
                </h1>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  Workspace & Tasks
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200/80 text-gray-600 text-xs font-medium shadow-xs">
                <Sparkles size={13} className="text-blue-500" />
                Team Workspace
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-3 tracking-tight leading-snug">
                Build better projects, together.
              </h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Start tracking tasks, managing projects, and collaborating with your team in seconds.
              </p>
            </div>
          </div>

          {/* Bottom info */}
          <div className="relative z-10 pt-6 mt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-emerald-500" /> Enterprise-ready security
            </span>
            <span>Free forever</span>
          </div>
        </div>

        {/* RIGHT FORM PANEL (Fits in 1 window, no scrolling) */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Create an account
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your details to create your workspace.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* USERNAME */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name / Username
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 focus-within:border-gray-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 transition">
                  <User2 size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Mihir Sonar"
                    className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 focus-within:border-gray-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 transition">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 focus-within:border-gray-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 transition">
                  <Lock size={16} className="text-gray-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-700 transition shrink-0"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className="w-full rounded-xl bg-gray-900 hover:bg-black disabled:opacity-60 py-2.5 text-white text-xs font-semibold transition shadow-sm hover:shadow flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Creating workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-xs text-gray-500 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-gray-900 hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;