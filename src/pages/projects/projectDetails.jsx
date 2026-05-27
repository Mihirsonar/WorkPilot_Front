import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getProjectById } from "../../services/project.services";

import TaskBoard from "../../components/task/TaskBoard";
import CreateTaskModel from "../tasks/CreateTaskModel";

import {
  Plus,
  Users,
  CalendarDays,
  Sparkles,
  FolderKanban,
} from "lucide-react";

function ProjectDetails() {
  const { projectId } = useParams();

  const [openmodel, setOpenModel] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
  });

  const project = data?.data;

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-white">
        <div className="h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />

        <p className="mt-6 text-slate-400 text-lg">
          Loading project workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/10 p-6 md:p-8">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          {/* LEFT */}
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
              <FolderKanban
                size={32}
                className="text-indigo-400"
              />
            </div>

            {/* Project Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles
                  size={18}
                  className="text-indigo-300"
                />

                <span className="text-sm font-medium text-indigo-300">
                  Active Workspace
                </span>
              </div>

              <h1 className="text-4xl font-bold text-white tracking-tight">
                {project?.name || "Untitled Project"}
              </h1>

              <p className="text-slate-300 mt-3 max-w-2xl">
                Manage tasks, collaborate with your
                team and track progress using your
                modern Kanban workflow.
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mt-6">
                {/* Members */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Users
                      size={18}
                      className="text-cyan-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Team Members
                    </p>

                    <h3 className="text-sm font-semibold text-white">
                      {project?.members?.length || 0} Members
                    </h3>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <CalendarDays
                      size={18}
                      className="text-orange-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <h3 className="text-sm font-semibold text-white">
                      In Progress
                    </h3>
                  </div>
                </div>
              </div>

              {/* Members Avatar */}
              <div className="flex items-center mt-6">
                {project?.members?.slice(0, 5).map(
                  (member, index) => (
                    <div
                      key={member._id}
                      title={member.username}
                      className={`h-11 w-11 rounded-full border-2 border-[#0f172a] bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold -ml-2 first:ml-0`}
                      style={{
                        zIndex:
                          project.members.length - index,
                      }}
                    >
                      {member.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )
                )}

                {project?.members?.length > 5 && (
                  <div className="h-11 w-11 rounded-full border-2 border-[#0f172a] bg-slate-700 text-white flex items-center justify-center text-xs font-semibold -ml-2">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setOpenModel(true)}
              className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={20} />

                Add New Task
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* TASK BOARD */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 md:p-6">
        <TaskBoard projectId={projectId} />
      </div>

      {/* CREATE TASK MODAL */}
      {openmodel && (
        <CreateTaskModel
          projectId={projectId}
          members={project?.members || []}
          onClose={() => setOpenModel(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetails;