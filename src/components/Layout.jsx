import { Outlet } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar";
import Sidepanel from "./Sidepanel";

export default function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#020617] text-white flex">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidepanel />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] p-4 md:p-6 lg:p-8">
          {/* Glass Container */}
          <div className="min-h-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/20 p-5 md:p-7">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Background Blur Effects */}
      <div className="pointer-events-none fixed top-0 left-0 h-72 w-72 bg-indigo-600/20 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72 bg-cyan-500/10 blur-[120px]" />
    </div>
  );
}