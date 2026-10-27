import React, { useState } from "react";
import { loginUser } from "../../services/auth.service.js";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  FolderKanban,
  CheckCircle2,
  Users,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("accessToken", data.data.accessToken);
      toast.success("Login successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4 sm:p-6 lg:overflow-hidden select-none">
      {/* CARD CONTAINER - SINGLE WINDOW FIT */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT SHOWCASE PANEL (Inspired by reference screenshot) */}
        <div className="lg:col-span-5 bg-[#f8f9fb] border-r border-gray-200/70 p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle accent blur */}
          <div className="absolute -top-12 -left-12 h-44 w-44 bg-indigo-100/60 rounded-full blur-2xl pointer-events-none" />

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
                <Sparkles size={13} className="text-amber-500" />
                Modern SaaS Flow
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-3 tracking-tight leading-snug">
                Organize work with simplicity & clarity.
              </h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Streamline projects, visualize sprints, and boost productivity with a modern Kanban workspace.
              </p>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 pt-6 mt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Users size={14} className="text-gray-400" /> Fast & collaborative
            </span>
            <span>v2.4</span>
          </div>
        </div>

        {/* RIGHT FORM PANEL (Compact, perfectly aligned in 1 window) */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="head1@wp.com"
                    className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-xs text-gray-500 hover:text-gray-900 font-medium transition"
                  >
                    Forgot password?
                  </button>
                </div>
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

              {/* REMEMBER ME */}
              <div className="flex items-center text-xs pt-0.5">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-0 accent-gray-900"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                type="submit"
                className="w-full rounded-xl bg-gray-900 hover:bg-black disabled:opacity-60 py-2.5 text-white text-xs font-semibold transition shadow-sm hover:shadow flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-gray-900 hover:underline font-semibold"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;