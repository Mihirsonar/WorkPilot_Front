import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Pencil,
  Trash2,
  FolderKanban,
  Users,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

// AVATAR COLORS
const colors = [
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
];

const getColor = (id = "") => {
  const hash = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md hover:border-gray-300 cursor-pointer transition select-none flex flex-col justify-between"
    >
      {/* TOP */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center shrink-0">
              <FolderKanban size={20} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Sparkles size={11} /> Active
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-1 leading-snug group-hover:text-black">
                {project.name}
              </h3>
            </div>
          </div>

          {/* MENU */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition"
            >
              <MoreVertical size={16} />
            </button>

            {/* DROPDOWN */}
            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-9 right-0 w-40 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-20 p-1"
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    onEdit(project);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <Pencil size={14} className="text-gray-500" />
                  Edit Project
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    onDelete(project._id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 size={14} className="text-rose-500" />
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
          {project.description || "No description provided for this workspace."}
        </p>
      </div>

      {/* BOTTOM */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
        {/* TEAM MEMBERS */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.members?.slice(0, 3).map((member) => (
              <div
                key={member._id}
                title={member.username}
                className={`h-7 w-7 rounded-full ${getColor(
                  member._id
                )} flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs`}
              >
                {getInitials(member.username)}
              </div>
            ))}

            {project.totalMembers > 3 && (
              <div className="h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                +{project.totalMembers - 3}
              </div>
            )}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            {project.members?.length || 0} members
          </span>
        </div>

        {/* OPEN LINK */}
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 group-hover:text-black">
          <span>Open board</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}