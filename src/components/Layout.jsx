import { Outlet } from "react-router-dom";
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar"

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}