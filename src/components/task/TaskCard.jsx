import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { motion } from "framer-motion";

import {
  GripVertical,
  CalendarDays,
  CircleDashed,
} from "lucide-react";

function TaskCard({
  task,
  isDragging,
  onClick,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: String(task._id),
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,

    opacity: isDragging ? 0.4 : 1,
  };

  const username =
    typeof task.assignedTo ===
    "object"
      ? task.assignedTo?.username
      : "";

  // STATUS COLORS
  const statusStyles = {
    todo: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",

    in_progress:
      "bg-orange-500/10 text-orange-300 border border-orange-500/20",

    done: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827] p-5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-black/20 ${
        isDragging
          ? "rotate-2 shadow-2xl"
          : ""
      }`}
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 h-28 w-28 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* TOP */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Left */}
        <div className="flex-1">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              statusStyles[
                task.status
              ]
            }`}
          >
            <CircleDashed size={12} />

            {task.status === "todo" &&
              "Todo"}

            {task.status ===
              "in_progress" &&
              "In Progress"}

            {task.status ===
              "done" && "Completed"}
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-white leading-snug">
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="mt-3 text-sm text-slate-400 line-clamp-3 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          onClick={(e) =>
            e.stopPropagation()
          }
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-500/20 transition-all duration-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
      </div>

      {/* BOTTOM */}
      <div className="relative z-10 flex items-center justify-between mt-6">
        {/* Assignee */}
        {username ? (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-sm font-semibold shadow-lg shadow-indigo-500/20">
              {username[0]
                .toUpperCase()}
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Assigned To
              </p>

              <h5 className="text-sm font-medium text-slate-200">
                {username}
              </h5>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">
            Unassigned
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={14} />

          Today
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;