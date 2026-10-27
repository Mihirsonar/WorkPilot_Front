import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  LogOut,
  Search,
  Zap,
  Calendar,
  Users,
  Inbox,
  TrendingUp,
  PanelLeftClose,
  Plus,
} from "lucide-react";
import { logoutUser } from "../services/auth.service";

function Sidepanel() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const mainNav = [
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
      name: "Tasks",
      path: "/my-tasks",
      icon: CheckSquare,
    },
  ];

  return (
    <aside className="h-screen w-[260px] bg-[#fbfcfd] border-r border-gray-200/80 text-gray-700 flex flex-col justify-between p-4 select-none">
      {/* TOP SECTION */}
      <div>
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-2 py-1 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <Zap size={16} className="fill-white" />
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">
              WorkPilot
            </span>
          </div>
          <button
            title="Collapse Sidebar"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Search input (as in reference screenshot) */}
        <div className="mb-4 px-1">
          <div className="flex items-center justify-between bg-gray-100/70 border border-gray-200/60 rounded-xl px-3 py-1.5 text-gray-400 hover:border-gray-300 transition cursor-pointer">
            <div className="flex items-center gap-2 text-xs">
              <Search size={14} className="text-gray-400" />
              <span>Search...</span>
            </div>
            <span className="text-[10px] font-medium bg-white border border-gray-200/80 px-1.5 py-0.5 rounded text-gray-500 shadow-xs">
              ⌘ F
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/70 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-gray-900" : "text-gray-400"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 cursor-pointer">
            <Calendar size={16} className="text-gray-400" />
            <span>Schedule</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 cursor-pointer">
            <Users size={16} className="text-gray-400" />
            <span>Teams</span>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-5 pt-4 border-t border-gray-200/60 space-y-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 cursor-pointer">
            <div className="flex items-center gap-3">
              <Inbox size={16} className="text-gray-400" />
              <span>Inbox</span>
            </div>
            <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              6
            </span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 cursor-pointer">
            <TrendingUp size={16} className="text-gray-400" />
            <span>Analytics</span>
          </div>
        </div>

        {/* Workspaces / Design Lab section matching reference screenshot */}
        <div className="mt-5 pt-4 border-t border-gray-200/60">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold text-gray-400 tracking-wider">
              Workspaces
            </span>
            <button className="text-gray-400 hover:text-gray-700">
              <Plus size={13} />
            </button>
          </div>

          <div className="space-y-1 px-1">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-100/70 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                  O
                </div>
                <span className="truncate text-xs">Olivia Bennett</span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-100/70 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                  S
                </div>
                <span className="truncate text-xs">Sophie Kim</span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            </div>

            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-100/70 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
                  M
                </div>
                <span className="truncate text-xs">Maya Green</span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-1 pt-3 border-t border-gray-200/70">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
            location.pathname === "/settings"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200/70 font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
          }`}
        >
          <Settings size={16} className="text-gray-400" />
          <span>Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut size={16} className="text-rose-500" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidepanel;