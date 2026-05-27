import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  deleteProject,
  updateProject,
} from "../../services/project.services.js";

import { createProject } from "../../services/createProject.service.js";

import ProjectCard from "../../components/project/ProjectCard";
import CreateProjectModel from "../../components/project/CreateProjectModel";

import React, { useState } from "react";
import toast from "react-hot-toast";

import {
  FolderKanban,
  Plus,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

function Projects() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  const queryClient = useQueryClient();

  // 📦 GET PROJECTS
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // ➕ CREATE
  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      toast.success("Project created 🚀");

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setIsCreateProjectModalOpen(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    },
  });

  // 🗑 DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: () => {
      toast.success("Project deleted 🗑");

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },

    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  // ✏️ UPDATE
  const updateMutation = useMutation({
    mutationFn: updateProject,

    onSuccess: () => {
      toast.success("Project updated ✏️");

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },

    onError: () => {
      toast.error("Failed to update project");
    },
  });

  // HANDLERS
  const handleCreateProject = (data) => {
    createMutate(data);
  };

  const handleDelete = (id) => {
    if (
      confirm(
        "Are you sure you want to delete this project?"
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (project) => {
    const name = prompt(
      "Enter new project name",
      project.name
    );

    const description = prompt(
      "Enter new description",
      project.description
    );

    if (!name) return;

    updateMutation.mutate({
      projectId: project._id,
      data: { name, description },
    });
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-white">
        <div className="h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />

        <p className="mt-6 text-slate-400 text-lg">
          Loading your projects...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
              <FolderKanban
                size={28}
                className="text-indigo-400"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Projects
              </h1>

              <p className="text-slate-400 mt-1">
                Organize and manage all your workspaces
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Total Projects */}
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <LayoutGrid
              size={20}
              className="text-cyan-400"
            />

            <div>
              <p className="text-xs text-slate-400">
                Total Projects
              </p>

              <h3 className="text-lg font-semibold text-white">
                {projects.length}
              </h3>
            </div>
          </div>

          {/* Create Button */}
          <button
            className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
            onClick={() =>
              setIsCreateProjectModalOpen(true)
            }
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={18} />

              Create Project
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>
      </div>

      {/* FEATURE BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/10 p-6 md:p-8">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles
                size={20}
                className="text-indigo-300"
              />

              <span className="text-indigo-300 font-medium text-sm">
                Productivity Workspace
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white leading-tight">
              Build, manage & track projects faster 🚀
            </h2>

            <p className="text-slate-300 mt-3 max-w-2xl">
              Keep your team aligned with modern
              Kanban workflows, task tracking and
              smart collaboration tools.
            </p>
          </div>

          <button className="bg-white text-indigo-700 px-5 py-3 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-300">
            Explore Features
          </button>
        </div>
      </div>

      {/* PROJECT GRID */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/[0.03]">
          <div className="h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
            <FolderKanban
              size={42}
              className="text-indigo-400"
            />
          </div>

          <h2 className="text-2xl font-bold text-white">
            No Projects Yet
          </h2>

          <p className="text-slate-400 mt-3 max-w-md text-center">
            Start creating your first workspace and
            organize tasks with a modern Kanban flow.
          </p>

          <button
            onClick={() =>
              setIsCreateProjectModalOpen(true)
            }
            className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* MODAL */}
      {isCreateProjectModalOpen && (
        <CreateProjectModel
          onClose={() =>
            setIsCreateProjectModalOpen(false)
          }
          onCreate={handleCreateProject}
          isLoading={isPending}
        />
      )}
    </div>
  );
}

export default Projects;