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
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  FolderKanban,
} from "lucide-react";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const navigate =
    useNavigate();

  // LOGIN
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data =
        await loginUser({
          email,
          password,
        });

      localStorage.setItem(
        "accessToken",
        data.data.accessToken
      );

      toast.success(
        "Login successful 🎉"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] flex items-center justify-center px-4 py-10">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 h-72 w-72 bg-indigo-600/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-72 w-72 bg-cyan-500/10 blur-[120px]" />

      {/* GRID EFFECT */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* CONTAINER */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/40 max-w-6xl w-full">
        {/* LEFT PANEL */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 border-r border-white/10 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 h-60 w-60 bg-indigo-500/20 blur-3xl rounded-full" />

          {/* TOP */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <div className="h-16 w-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FolderKanban
                  size={32}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white">
                  WorkPilot
                </h1>

                <p className="text-slate-400 mt-1">
                  Modern Project
                  Management
                </p>
              </div>
            </div>

            {/* HERO */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
                <Sparkles size={16} />

                Productivity Workspace
              </div>

              <h2 className="text-5xl font-bold text-white leading-tight">
                Organize Work
                <br />
                Like Never Before 🚀
              </h2>

              <p className="text-slate-400 mt-6 text-lg leading-relaxed max-w-lg">
                Collaborate with
                your team, manage
                Kanban boards and
                track tasks with
                your modern SaaS
                productivity
                platform.
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="relative z-10 grid grid-cols-1 gap-4 mt-12">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <ShieldCheck
                  size={22}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  Secure Workspace
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Protected
                  authentication &
                  data safety.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Sparkles
                  size={22}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  Smart Workflow
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Drag & drop
                  Kanban task
                  management.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="flex items-center justify-center p-6 md:p-10"
        >
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <div className="h-14 w-14 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FolderKanban
                  size={28}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  WorkPilot
                </h1>

                <p className="text-xs text-slate-400">
                  Productivity App
                </p>
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-white">
                Welcome Back 👋
              </h2>

              <p className="text-slate-400 mt-3">
                Login to continue
                managing your
                projects and tasks.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Mail
                    size={16}
                    className="text-indigo-400"
                  />

                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 focus-within:border-indigo-500/40 transition-all duration-300">
                  <Mail
                    size={18}
                    className="text-slate-500"
                  />

                  <input
                    type="email"
                    value={
                      email
                    }
                    onChange={(
                      e
                    ) =>
                      setEmail(
                        e.target
                          .value
                      )
                    }
                    placeholder="head1@wp.com"
                    className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Lock
                    size={16}
                    className="text-cyan-400"
                  />

                  Password
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 focus-within:border-indigo-500/40 transition-all duration-300">
                  <Lock
                    size={18}
                    className="text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      password
                    }
                    onChange={(
                      e
                    ) =>
                      setPassword(
                        e.target
                          .value
                      )
                    }
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="text-slate-500 hover:text-white transition"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-indigo-500"
                  />

                  Remember me
                </label>

                <button
                  type="button"
                  className="text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                disabled={
                  loading
                }
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 py-4 text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Signing In...
                  </>
                ) : (
                  <>
                    Login

                    <ArrowRight
                      size={18}
                    />
                  </>
                )}
              </motion.button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-sm text-slate-500 mt-8">
              Don’t have an
              account?{" "}
              <Link
                to="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;