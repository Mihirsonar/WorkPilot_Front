import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-8">

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/10 p-8 mb-8">
        <div className="absolute top-0 right-0 h-72 w-72 bg-indigo-500/20 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
       <button
  onClick={() => navigate("/")}
  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] text-white transition-all duration-300"
>
  <ArrowLeft size={18} />
  Back to Dashboard
</button>

            <h1 className="text-5xl font-bold leading-tight">
              Manage Your
              <br />
              Workspace Settings 🚀
            </h1>

            <p className="text-slate-300 mt-5 max-w-2xl text-lg leading-relaxed">
              Customize your WorkPilot experience, manage team permissions,
              notifications, integrations and security preferences.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[320px]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
              <p className="text-slate-400 text-sm">Active Projects</p>
              <h2 className="text-4xl font-bold mt-2">12</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
              <p className="text-slate-400 text-sm">Members</p>
              <h2 className="text-4xl font-bold mt-2">24</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
              <p className="text-slate-400 text-sm">Notifications</p>
              <h2 className="text-4xl font-bold mt-2">18</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
              <p className="text-slate-400 text-sm">Security</p>
              <h2 className="text-4xl font-bold mt-2">98%</h2>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="xl:col-span-2 space-y-8">
          {/* PROFILE SETTINGS */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Profile Settings
                </h2>

                <p className="text-slate-400 mt-2">
                  Update your personal information and workspace profile.
                </p>
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-2xl font-medium shadow-lg shadow-indigo-500/20">
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-3">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Mihir Sonar"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="mihir@workpilot.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">
                  Role
                </label>

                <input
                  type="text"
                  placeholder="Frontend Developer"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">
                  Workspace Name
                </label>

                <input
                  type="text"
                  placeholder="WorkPilot Team"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* SECURITY SETTINGS */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Security Settings
              </h2>

              <p className="text-slate-400 mt-2">
                Manage passwords and workspace security preferences.
              </p>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Two-Factor Authentication
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm">
                    Add an extra layer of protection to your account.
                  </p>
                </div>

                <button className="bg-emerald-500/10 text-emerald-300 px-5 py-3 rounded-2xl font-medium border border-emerald-500/20">
                  Enabled
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Change Password
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm">
                    Update your password regularly for better security.
                  </p>
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-2xl font-medium shadow-lg shadow-indigo-500/20">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Notification Preferences
              </h2>

              <p className="text-slate-400 mt-2">
                Control how you receive updates and alerts.
              </p>
            </div>

            <div className="space-y-5">
              {["Email Notifications", "Task Reminders", "Team Updates", "Weekly Reports"].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {item}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      Receive notifications related to {item.toLowerCase()}.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />

                    <div className="w-14 h-8 bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300"></div>

                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-8">
          {/* PROFILE CARD */}
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-600/20 to-cyan-500/10 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-4xl font-bold shadow-lg shadow-indigo-500/30">
                M
              </div>

              <h2 className="text-2xl font-bold mt-5">
                Mihir Sonar
              </h2>

              <p className="text-slate-300 mt-2">
                Frontend Developer
              </p>

              <button className="mt-6 w-full bg-white text-indigo-700 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-300">
                Edit Profile
              </button>
            </div>
          </div>

          {/* WORKSPACE INFO */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Workspace Overview
            </h2>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-slate-400 text-sm">
                  Current Plan
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  Pro Plan 🚀
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-slate-400 text-sm">
                  Storage Usage
                </p>

                <div className="mt-4 h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                </div>

                <p className="text-sm text-slate-400 mt-3">
                  72GB of 100GB Used
                </p>
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="rounded-[32px] border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-6">
            <h2 className="text-2xl font-bold text-red-300 mb-4">
              Danger Zone
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Permanently delete your workspace, projects and all associated data.
            </p>

            <button className="w-full mt-6 bg-red-500 hover:bg-red-400 transition py-4 rounded-2xl font-semibold shadow-lg shadow-red-500/20">
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
