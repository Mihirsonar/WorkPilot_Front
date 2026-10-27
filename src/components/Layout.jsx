import { Outlet } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar";
import Sidepanel from "./Sidepanel";

export default function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#f4f5f7] text-[#0f172a] flex">
      {/* Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidepanel />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f4f5f7] p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}