import React from "react";

import { useDroppable } from "@dnd-kit/core";

import TaskCard from "./TaskCard";

import {
  CircleDashed,
  Activity,
  CheckCircle2,
  Plus,
} from "lucide-react";

function TaskColumn({
  id,
  title,
  tasks = [],
  activeTask,
  onTaskClick,
}) {
  const { setNodeRef, isOver } =
    useDroppable({
      id,
    });

  // COLUMN STYLES
  const columnStyles = {
    todo: {
      icon: (
        <CircleDashed
          size={20}
          className="text-indigo-400"
        />
      ),

      badge:
        "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",

      glow: "bg-indigo-500/10",
    },

    in_progress: {
      icon: (
        <Activity
          size={20}
          className="text-orange-400"
        />
      ),

      badge:
        "bg-orange-500/10 text-orange-300 border border-orange-500/20",

      glow: "bg-orange-500/10",
    },

    done: {
      icon: (
        <CheckCircle2
          size={20}
          className="text-emerald-400"
        />
      ),

      badge:
        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",

      glow: "bg-emerald-500/10",
    },
  };

  const currentStyle =
    columnStyles[id];

  return (
    <div
      ref={setNodeRef}
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 min-h-[650px] ${
        isOver
          ? "border-indigo-500/40 bg-indigo-500/5 scale-[1.01]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {/* Glow */}
      <div
        className={`absolute top-0 right-0 h-40 w-40 blur-3xl rounded-full ${currentStyle.glow}`}
      />

      {/* HEADER */}
      <div className="relative z-10 border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {currentStyle.icon}
            </div>

            {/* Info */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                {tasks.length} Tasks
              </p>
            </div>
          </div>

          {/* Count Badge */}
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${currentStyle.badge}`}
          >
            {tasks.length}
          </div>
        </div>
      </div>

      {/* TASKS */}
      <div className="relative z-10 p-4 space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isDragging={
                activeTask?._id ===
                task._id
              }
              onClick={
                onTaskClick
              }
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
              <Plus
                size={28}
                className="text-slate-500"
              />
            </div>

            <h4 className="text-white font-medium">
              No Tasks Yet
            </h4>

            <p className="text-sm text-slate-500 mt-2 text-center max-w-[220px]">
              Drag tasks here or create a
              new task for this column.
            </p>
          </div>
        )}
      </div>

      {/* DROP INDICATOR */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-indigo-500/40 rounded-3xl pointer-events-none animate-pulse" />
      )}
    </div>
  );
}

export default TaskColumn;