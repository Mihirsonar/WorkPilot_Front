import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

function Sidepanel() {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "My Tasks",
      path: "/my-tasks",
      icon: ListTodo,
    },
  ];

  return (
    <aside className="h-screen w-[280px] bg-[#0f172a] border-r border-white/10 text-white flex flex-col justify-between p-5">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              WorkPilot
            </h1>

            <p className="text-xs text-slate-400">
              Project Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "hover:bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-all ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                <span className="font-medium text-sm">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Workspace Card */}
        <div className="mt-10 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-28 w-28 bg-white/10 rounded-full blur-2xl" />

          <h2 className="text-lg font-semibold relative z-10">
            Upgrade Workspace 🚀
          </h2>

          <p className="text-sm text-indigo-100 mt-2 relative z-10">
            Unlock advanced productivity features and team collaboration tools.
          </p>

          <button className="mt-5 w-full bg-white text-indigo-700 font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-all duration-300">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="space-y-3">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-300">
          <Settings size={20} />
          <span className="text-sm font-medium">
            Settings
          </span>
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-300">
          <LogOut size={20} />
          <span className="text-sm font-medium">
            Logout
          </span>
        </button>

        {/* User Profile */}
        {/* <div className="mt-5 border border-white/10 bg-white/5 rounded-2xl p-4 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100"
            alt="user"
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-sm">
              Mihir Sonar
            </h3>

            <p className="text-xs text-slate-400">
              Frontend Developer
            </p>
          </div>
        </div> */}
      </div>
    </aside>
  );
}

export default Sidepanel;