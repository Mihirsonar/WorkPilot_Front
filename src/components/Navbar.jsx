import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, logoutUser } from "../services/auth.service";
import {
  Search,
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  LogOut,
  ChevronDown,
  Layers,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: username,
    isLoading,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const getPageTitle = () => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname.startsWith("/projects")) return "Design Lab";
    if (location.pathname === "/my-tasks") return "Tasks";
    if (location.pathname === "/settings") return "Settings";
    return "Workspace";
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 md:px-6 py-3 select-none">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Project / Workspace Indicator (matching screenshot) */}
          <div className="flex items-center gap-3">
            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <Menu size={18} className="text-gray-700" />
            </button>

            {/* Back button (matching screenshot) */}
            <button
              onClick={() => window.history.back()}
              className="hidden sm:flex h-8 w-8 rounded-lg hover:bg-gray-100 items-center justify-center text-gray-500 transition"
              title="Go back"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Icon box (Black rounded squircle with 3D/layers icon, like screenshot) */}
            <div className="h-8 w-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <Layers size={16} />
            </div>

            {/* Page / Workspace title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-none">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* RIGHT: Search & User Profile */}
          <div className="flex items-center gap-3">
            {/* Search input on desktop */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100/80 border border-gray-200/60 rounded-xl px-3 py-1.5 w-60 hover:border-gray-300 transition">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent outline-none w-full text-xs text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="hidden sm:block text-left">
                  <h3 className="text-xs font-semibold text-gray-900 leading-none">
                    {isLoading ? "Loading..." : username || "Admin"}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Workspace Owner
                  </p>
                </div>

                <ChevronDown size={14} className="hidden sm:block text-gray-400" />
              </div>

              {/* Profile Menu Popup */}
              {profileOpen && (
                <div
                  onClick={() => setProfileOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{username || "Admin"}</p>
                    <p className="text-[11px] text-gray-400">Workspace Member</p>
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings size={14} className="text-gray-400" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut size={14} className="text-rose-500" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUB-HEADER TABS (matching reference screenshot) */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pt-3 mt-1 border-t border-gray-100 text-xs text-gray-500">
          <Link
            to="/"
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              location.pathname === "/"
                ? "text-gray-900 font-bold border-b-2 border-gray-900 rounded-none pb-1.5"
                : "hover:text-gray-900"
            }`}
          >
            Overview
          </Link>
          <Link
            to="/my-tasks"
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              location.pathname === "/my-tasks"
                ? "text-gray-900 font-bold border-b-2 border-gray-900 rounded-none pb-1.5"
                : "hover:text-gray-900"
            }`}
          >
            Tasks
          </Link>
          <Link
            to="/projects"
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              location.pathname.startsWith("/projects")
                ? "text-gray-900 font-bold border-b-2 border-gray-900 rounded-none pb-1.5"
                : "hover:text-gray-900"
            }`}
          >
            Projects
          </Link>
          <span className="px-3 py-1 rounded-lg font-medium whitespace-nowrap text-gray-400 hover:text-gray-600 cursor-pointer">
            Workload
          </span>
          <span className="px-3 py-1 rounded-lg font-medium whitespace-nowrap text-gray-400 hover:text-gray-600 cursor-pointer">
            Team
          </span>
          <span className="px-3 py-1 rounded-lg font-medium whitespace-nowrap text-gray-400 hover:text-gray-600 cursor-pointer">
            Documents
          </span>
          <span className="px-3 py-1 rounded-lg font-medium whitespace-nowrap text-gray-400 hover:text-gray-600 cursor-pointer">
            Timesheet
          </span>
          <span className="px-3 py-1 rounded-lg font-medium whitespace-nowrap text-gray-400 hover:text-gray-600 cursor-pointer">
            Activity
          </span>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-gray-200 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gray-900 text-white flex items-center justify-center">
              <Layers size={16} />
            </div>
            <h2 className="text-base font-bold text-gray-900">WorkPilot</h2>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
              location.pathname === "/"
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
              location.pathname.startsWith("/projects")
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FolderKanban size={16} />
            <span>Projects</span>
          </Link>

          <Link
            to="/my-tasks"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
              location.pathname === "/my-tasks"
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CheckSquare size={16} />
            <span>Tasks</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
              location.pathname === "/settings"
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}