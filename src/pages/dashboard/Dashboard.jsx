import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "../../services/project.services.js";
import { createProject } from "../../services/createProject.service.js";
import CreateProjectModel from "../../components/project/CreateProjectModel";
import JoinProjectModal from "../../components/project/JoinProjectModal";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  ListTodo,
  ArrowRight,
  Plus,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  Link2,
} from "lucide-react";

export default function Dashboard() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created successfully 🚀");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreateProjectModalOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create project"
      );
    },
  });

  const totalProjects = projects?.length || 0;

  const handleCreateProject = (data) => {
    createMutate(data);
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Welcome back 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your projects, review sprint workloads, and collaborate seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow cursor-pointer"
          >
            <Link2 size={15} />
            <span>Join with Link</span>
          </button>

          <button
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow cursor-pointer"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* FILTER PILLS ROW (Replicating reference screenshot) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide py-1">
        <div className="flex items-center gap-2">
          {["Role", "Status", "Workload", "Skills"].map((filter) => (
            <button
              key={filter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 text-xs font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-xs transition"
            >
              <span>{filter}</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 text-xs font-medium text-gray-700 shadow-xs">
          <LayoutGrid size={14} className="text-gray-500" />
          <span>Cards view</span>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Link
          to="/projects"
          className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              Total Workspaces
            </span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLoading ? "..." : totalProjects}
            </h2>
          </div>
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </span>
            <span className="text-gray-400">Active</span>
          </div>
        </Link>

        {/* My Tasks */}
        <Link
          to="/my-tasks"
          className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              Assigned Tasks
            </span>
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ListTodo size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-900">24</h2>
          </div>
          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-sky-600 font-semibold group-hover:underline flex items-center gap-1">
              Check tasks <ArrowRight size={13} />
            </span>
            <span className="text-gray-400">In sprint</span>
          </div>
        </Link>

        {/* Completed */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              Completed Tasks
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-900">18</h2>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">75%</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              Pending Review
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-gray-900">6</h2>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-amber-500 rounded-full" />
            </div>
            <span className="text-[11px] font-semibold text-amber-600">25%</span>
          </div>
        </div>
      </div>

      {/* SAMPLE WORKLOAD CARDS SECTION (Faithful recreation of reference image layout) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">Active Sprints & Workload</h2>
            <span className="h-5 w-5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold flex items-center justify-center">
              3
            </span>
          </div>
          <Link to="/projects" className="text-xs text-gray-500 hover:text-gray-900 font-medium">
            View all workspaces →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
                  OB
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-none">
                    Olivia Bennett
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Product Manager</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                97%
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
                <span>29/30h</span>
                <span className="font-semibold text-gray-700">97%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[97%] bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span className="truncate">Review final UI assets for market launch</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold">
                  SK
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-none">
                    Sophie Kim
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Project Lead</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                87%
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
                <span>35/40h</span>
                <span className="font-semibold text-gray-700">87%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[87%] bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
              <Clock3 size={14} className="text-amber-500 shrink-0" />
              <span className="truncate">Coordinate user journey map updates</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">
                  MG
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-none">
                    Maya Green
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Business Analyst</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                65%
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
                <span>13/20h</span>
                <span className="font-semibold text-gray-700">65%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-amber-500 rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
              <Clock3 size={14} className="text-amber-500 shrink-0" />
              <span className="truncate">Prepare feature requirements & KPIs</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY & PRODUCTIVITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Recent Workspace Activity</h2>
            <span className="text-xs text-gray-400">Real-time updates</span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                text: "New task added in Design Lab Kanban",
                time: "2 min ago",
                dot: "bg-emerald-500",
              },
              {
                text: "Authentication & UI alignment tweaks applied",
                time: "10 min ago",
                dot: "bg-blue-500",
              },
              {
                text: "Sprint milestones reviewed by Project Lead",
                time: "1 hour ago",
                dot: "bg-amber-500",
              },
              {
                text: "New workspace created successfully",
                time: "3 hours ago",
                dot: "bg-indigo-500",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${activity.dot}`} />
                  <p className="text-xs text-gray-700 font-medium">
                    {activity.text}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Goal */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Sprint Health</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Sparkles size={11} /> On track
              </span>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="relative h-32 w-32 rounded-full border-[10px] border-gray-100 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[10px] border-gray-900 border-t-transparent rotate-45" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">78%</h3>
                  <p className="text-[11px] text-gray-400">Velocity</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Weekly Goal</span>
                <span className="font-semibold text-gray-800">78%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[78%] bg-gray-900 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Tasks Completed</span>
                <span className="font-semibold text-gray-800">62%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[62%] bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE PROJECT MODAL */}
      {isCreateProjectModalOpen && (
        <CreateProjectModel
          onClose={() => setIsCreateProjectModalOpen(false)}
          onCreate={handleCreateProject}
          isLoading={isPending}
        />
      )}

      {/* JOIN PROJECT MODAL */}
      {isJoinModalOpen && (
        <JoinProjectModal onClose={() => setIsJoinModalOpen(false)} />
      )}
    </div>
  );
}