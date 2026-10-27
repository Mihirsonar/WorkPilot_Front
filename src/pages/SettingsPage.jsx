import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Shield, Bell, User, HardDrive, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-gray-900 p-4 sm:p-6 md:p-8">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition mb-4 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Workspace Settings
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            Configure your profile, manage workspace preferences, security protocols, and notifications.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-[260px]">
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5">
            <p className="text-[11px] font-semibold text-gray-400">Active Workspaces</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">12</h2>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5">
            <p className="text-[11px] font-semibold text-gray-400">Team Members</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">24</h2>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="xl:col-span-2 space-y-6">
          {/* PROFILE SETTINGS */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Profile Details</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your personal information and public display details.
                </p>
              </div>

              <button className="bg-gray-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition">
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Mihir Sonar"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="mihir@workpilot.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Role
                </label>
                <input
                  type="text"
                  defaultValue="Workspace Lead"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  defaultValue="WorkPilot Team"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* SECURITY SETTINGS */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900">Security & Authentication</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage your credentials and protect account access.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Add an extra verification step for enhanced security.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <Check size={12} /> Enabled
                </span>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Password</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last changed 2 months ago.
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="mb-5">
              <h2 className="text-base font-bold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Select the channel and frequency for task notifications.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Email notifications for assigned tasks",
                "Due date reminders and sprint alerts",
                "Team comments and status updates",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/70"
                >
                  <span className="text-xs font-medium text-gray-700">{item}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs text-center">
            <div className="h-20 w-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-xs">
              M
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-3">Mihir Sonar</h3>
            <p className="text-xs text-gray-400">Workspace Administrator</p>

            <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2.5 rounded-xl transition">
              Change Avatar
            </button>
          </div>

          {/* PLAN OVERVIEW */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900">Workspace Plan</h3>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Pro Tier
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
                <span>Storage</span>
                <span className="font-semibold text-gray-700">72GB / 100GB</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-gray-900 rounded-full" />
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-3">
            <h3 className="text-xs font-bold text-rose-700">Danger Zone</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Permanently delete this workspace and all associated boards.
            </p>
            <button className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-xs">
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
