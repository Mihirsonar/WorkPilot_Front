import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "../../services/project.services.js";
import { createProject } from "../../services/createProject.service.js";
import CreateProjectModel from "../../components/project/CreateProjectModel";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  ListTodo,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
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
      toast.error(error?.response?.data?.message || "Failed to create project");
    },
  });

  const totalProjects = projects?.length || 0;

  const handleCreateProject = (data) => {
    createMutate(data);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back 👋
          </h1>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Manage your projects, tasks and productivity in one place.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 transition-all px-5 py-3 rounded-2xl font-medium shadow-lg shadow-indigo-500/20"
        >
          + Create Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Projects */}
        <Link
          to="/projects"
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Projects</p>

              <h2 className="text-4xl font-bold mt-3">
                {isLoading ? "..." : totalProjects}
              </h2>
            </div>

            <div className="bg-indigo-500/20 p-4 rounded-2xl">
              <FolderKanban size={28} className="text-indigo-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8 text-sm text-indigo-300">
            View Projects
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-all"
            />
          </div>

          <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/20 blur-3xl" />
        </Link>

        {/* My Tasks */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">My Tasks</p>

              <h2 className="text-4xl font-bold mt-3">24</h2>
            </div>

            <div className="bg-cyan-500/20 p-4 rounded-2xl">
              <ListTodo size={28} className="text-cyan-400" />
            </div>
          </div>

          <p className="mt-8 text-sm text-cyan-300">
            Tasks assigned to you
          </p>

          <div className="absolute -top-10 -right-10 h-32 w-32 bg-cyan-500/20 blur-3xl" />
        </div>

        {/* Completed */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed</p>

              <h2 className="text-4xl font-bold mt-3">18</h2>
            </div>

            <div className="bg-emerald-500/20 p-4 rounded-2xl">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
          </div>

          <p className="mt-8 text-sm text-emerald-300">
            Successfully completed
          </p>

          <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-500/20 blur-3xl" />
        </div>

        {/* Pending */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending</p>

              <h2 className="text-4xl font-bold mt-3">6</h2>
            </div>

            <div className="bg-orange-500/20 p-4 rounded-2xl">
              <Clock3 size={28} className="text-orange-400" />
            </div>
          </div>

          <p className="mt-8 text-sm text-orange-300">
            Tasks waiting to finish
          </p>

          <div className="absolute -top-10 -right-10 h-32 w-32 bg-orange-500/20 blur-3xl" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
        {/* Activity */}
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>

            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              "New task added in WorkPilot UI",
              "Bug fixed in authentication flow",
              "Dashboard updated successfully",
              "New member joined the project",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-indigo-400" />

                  <p className="text-sm text-slate-300">{activity}</p>
                </div>

                <span className="text-xs text-slate-500">2 min ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Productivity
          </h2>

          <div className="flex items-center justify-center">
            <div className="relative h-44 w-44 rounded-full border-[14px] border-indigo-500/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[14px] border-indigo-500 border-t-transparent rotate-45" />

              <div className="text-center">
                <h3 className="text-4xl font-bold">78%</h3>

                <p className="text-slate-400 text-sm mt-1">
                  Completed
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Weekly Goal</span>
                <span>78%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[78%] bg-indigo-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Project Progress</span>
                <span>62%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[62%] bg-cyan-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreateProjectModalOpen && (
        <CreateProjectModel
          onClose={() => setIsCreateProjectModalOpen(false)}
          onCreate={handleCreateProject}
          isLoading={isPending}
        />
      )}
    </div>
  );
}