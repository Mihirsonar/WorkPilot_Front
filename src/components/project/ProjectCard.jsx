import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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
  "from-indigo-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-green-500",
  "from-cyan-500 to-sky-500",
  "from-orange-500 to-amber-500",
];

const getColor = (id) => {
  const hash = id
    .split("")
    .reduce(
      (acc, char) =>
        acc +
        char.charCodeAt(0),
      0
    );

  return colors[
    hash % colors.length
  ];
};

// INITIALS
const getInitials = (
  name
) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}) {
  const navigate =
    useNavigate();

  const [open, setOpen] =
    useState(false);

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      onClick={() =>
        navigate(
          `/projects/${project._id}`
        )
      }
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827] p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-black/30 cursor-pointer"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* TOP */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-start gap-4">
          {/* ICON */}
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <FolderKanban
              size={28}
              className="text-indigo-400"
            />
          </div>

          {/* INFO */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <Sparkles
                size={12}
              />

              Active Project
            </div>

            {/* NAME */}
            <h3 className="text-2xl font-bold text-white leading-tight">
              {project.name}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-slate-400 text-sm mt-3 leading-relaxed line-clamp-3 max-w-[320px]">
              {project.description ||
                "No description available for this workspace."}
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();

              setOpen(
                (prev) => !prev
              );
            }}
            className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <MoreVertical
              size={18}
            />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="absolute top-14 right-0 w-44 rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden z-20"
            >
              {/* EDIT */}
              <button
                onClick={() => {
                  setOpen(false);

                  onEdit(
                    project
                  );
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-all duration-300"
              >
                <Pencil
                  size={16}
                  className="text-indigo-400"
                />

                Edit Project
              </button>

              {/* DELETE */}
              <button
                onClick={() => {
                  setOpen(false);

                  onDelete(
                    project._id
                  );
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                <Trash2
                  size={16}
                />

                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="relative z-10 flex items-center justify-between mt-8">
        {/* MEMBERS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users
              size={16}
              className="text-slate-500"
            />

            <span className="text-sm text-slate-400">
              Team Members
            </span>
          </div>

          <div className="flex -space-x-3">
            {project.members
              ?.slice(0, 4)
              .map((member) => (
                <div
                  key={
                    member._id
                  }
                  title={
                    member.username
                  }
                  className={`h-11 w-11 rounded-full bg-gradient-to-br ${getColor(
                    member._id
                  )} text-white flex items-center justify-center text-sm font-semibold border-2 border-[#111827] shadow-lg`}
                >
                  {getInitials(
                    member.username
                  )}
                </div>
              ))}

            {/* EXTRA MEMBERS */}
            {project.totalMembers >
              4 && (
              <div className="h-11 w-11 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-semibold border-2 border-[#111827]">
                +
                {project.totalMembers -
                  4}
              </div>
            )}
          </div>
        </div>

        {/* OPEN BUTTON */}
        <div className="flex items-center gap-2 text-indigo-300 font-medium group-hover:translate-x-1 transition-all duration-300">
          <span className="text-sm">
            Open
          </span>

          <ArrowUpRight
            size={18}
          />
        </div>
      </div>
    </motion.div>
  );
}