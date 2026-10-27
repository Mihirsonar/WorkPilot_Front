import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  deleteProject,
  updateProject,
} from "../../services/project.services.js";
import { createProject } from "../../services/createProject.service.js";
import ProjectCard from "../../components/project/ProjectCard";
import CreateProjectModel from "../../components/project/CreateProjectModel";
import JoinProjectModal from "../../components/project/JoinProjectModal";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  Sparkles,
  Loader2,
  Link2,
} from "lucide-react";

function Projects() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // GET PROJECTS
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // CREATE
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
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });

  // DELETE
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

  // UPDATE
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
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (project) => {
    const name = prompt("Enter new project name", project.name);
    const description = prompt("Enter new description", project.description);
    if (!name) return;

    updateMutation.mutate({
      projectId: project._id,
      data: { name, description },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
        <p className="mt-3 text-xs font-medium text-gray-500">
          Loading your workspaces...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Workspaces & Projects
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize all your team boards, tasks, and project workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow cursor-pointer"
          >
            <Link2 size={15} />
            <span>Join with Link</span>
          </button>

          <button
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* FEATURE BANNER (Soft, modern, light) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles size={12} />
            Agile Kanban Flow
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Track sprints, coordinate tasks & deliver faster
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Keep every teammate aligned with intuitive drag-and-drop boards, status badges, and real-time updates.
          </p>
        </div>

        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-800 transition"
        >
          Add Board
        </button>
      </div>

      {/* PROJECT GRID */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-xs">
          <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-600">
            <FolderKanban size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No projects yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            Create your first workspace to start assigning tasks and tracking team sprints.
          </p>
          <button
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Plus size={15} />
            <span>Create First Project</span>
          </button>
        </div>
      )}

      {/* MODAL */}
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


export default Projects;