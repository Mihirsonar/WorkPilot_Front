import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";
import {
  Bell,
  Search,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { data: username, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-2xl px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={18} className="text-white" />
            </div>

            <h1 className="text-xl font-bold text-white">
              WorkPilot
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 w-full max-w-xl hover:border-indigo-500/40 transition-all duration-300">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search projects, tasks, members..."
              className="bg-transparent outline-none w-full text-sm text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
            <Bell size={20} className="text-slate-300" />

            <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          {/* User Profile */}
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
                  : username || "Guest"}
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

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-sm text-white placeholder:text-slate-500"
          />
        </div>
      </div>
    </header>
  );
}