import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../services/project.services";
import TaskBoard from "../../components/task/TaskBoard";
import CreateTaskModel from "../tasks/CreateTaskModel";
import InviteMemberModal from "../../components/project/InviteMemberModal";
import {
  Plus,
  Users,
  CalendarDays,
  Sparkles,
  FolderKanban,
  Loader2,
  UserPlus,
} from "lucide-react";

function ProjectDetails() {
  const { projectId } = useParams();
  const [openmodel, setOpenModel] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
  });

  const project = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
        <p className="mt-3 text-xs font-medium text-gray-500">
          Loading project workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PROJECT BANNER */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <FolderKanban size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Sparkles size={11} /> Active Workspace
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400 font-medium">Kanban Board</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {project?.name || "Workspace"}
            </h1>

            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              {project?.description ||
                "Collaborate, assign tasks, and track sprints using this interactive Kanban board."}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" />
                <span>{project?.members?.length || 0} Members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-gray-400" />
                <span>Sprint in progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Invite</span>
          </button>
          <button
            onClick={() => setOpenModel(true)}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* TASK BOARD CONTAINER */}
      <div className="bg-transparent">
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

      {/* INVITE MEMBER MODAL */}
      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          projectName={project?.name}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetails;