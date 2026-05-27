import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../services/auth.service";

import {
  Bell,
  Search,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const {
    data: username,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-2xl px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4 flex-1">
            {/* MOBILE HAMBURGER */}
            <button
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="lg:hidden h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
            >
              <Menu
                size={22}
                className="text-white"
              />
            </button>

            {/* MOBILE LOGO */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles
                  size={18}
                  className="text-white"
                />
              </div>

              <h1 className="text-xl font-bold text-white">
                WorkPilot
              </h1>
            </div>

            {/* SEARCH BAR */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 w-full max-w-xl hover:border-indigo-500/40 transition-all duration-300">
              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search projects, tasks, members..."
                className="bg-transparent outline-none w-full text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            {/* <button className="relative h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
              <Bell
                size={20}
                className="text-slate-300"
              />

              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button> */}

            {/* USER PROFILE */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="h-11 w-11 rounded-xl object-cover"
              />

              <div className="hidden sm:block">
                <h3 className="text-sm font-semibold text-white leading-none">
                  {error
                    ? "Error"
                    : isLoading
                    ? "Loading..."
                    : username ||
                      "Guest"}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Workspace Owner
                </p>
              </div>

              <ChevronDown
                size={18}
                className="hidden sm:block text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden mt-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 z-[100] h-full w-[300px] bg-[#0f172a] border-r border-white/10 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles
                size={22}
                className="text-white"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                WorkPilot
              </h2>

              <p className="text-xs text-slate-400">
                Productivity Hub
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 transition-all duration-300"
          >
            <X
              size={20}
              className="text-white"
            />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="p-5 space-y-3">
          <Link
            to="/"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300 group"
          >
            <LayoutDashboard
              size={22}
              className="text-indigo-400"
            />

            <span className="text-white font-medium">
              Dashboard
            </span>
          </Link>

          <Link
            to="/projects"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300 group"
          >
            <FolderKanban
              size={22}
              className="text-cyan-400"
            />

            <span className="text-white font-medium">
              Projects
            </span>
          </Link>

          <Link
            to="/my-tasks"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300 group"
          >
            <CheckSquare
              size={22}
              className="text-emerald-400"
            />

            <span className="text-white font-medium">
              My Tasks
            </span>
          </Link>

          <Link
            to="/settings"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300 group"
          >
            <Settings
              size={22}
              className="text-orange-400"
            />

            <span className="text-white font-medium">
              Settings
            </span>
          </Link>
        </div>

        {/* BOTTOM PROFILE */}
        <div className="absolute bottom-0 left-0 w-full p-5 border-t border-white/10">
          <div className="flex items-center gap-4 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="h-12 w-12 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">
                {error
                  ? "Error"
                  : isLoading
                  ? "Loading..."
                  : username ||
                    "Guest"}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Workspace Owner
              </p>
            </div>

            <button className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-all duration-300">
              <LogOut
                size={18}
                className="text-red-400"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}