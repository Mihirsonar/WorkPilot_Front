import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  GripVertical,
  AlignLeft,
  CheckSquare,
} from "lucide-react";
import DueDateBadge from "../card/DueDateBadge.jsx";

function TaskCard({ task, isDragging, onClick }) {
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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const username =
    typeof task.assignedTo === "object" ? task.assignedTo?.username : "";

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.isCompleted).length;
  const labels = task.labels || [];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`group relative overflow-hidden rounded-xl border border-gray-200/90 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md cursor-pointer select-none shadow-xs ${
        isDragging ? "rotate-1 shadow-xl ring-2 ring-gray-900" : ""
      }`}
    >
      {/* Top Cover Banner */}
      {task.coverColor && (
        <div
          className="h-3.5 w-full transition-all"
          style={{ backgroundColor: task.coverColor }}
        />
      )}

      <div className="p-3">
        {/* Labels row */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {labels.map((lbl, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2 py-0.5 rounded text-white shadow-2xs"
                style={{
                  backgroundColor: lbl.color || "#0f172a",
                }}
              >
                {lbl.name}
              </span>
            ))}
          </div>
        )}

        {/* Title + Drag Handle */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-semibold text-gray-900 leading-snug flex-1 group-hover:text-black">
            {task.title}
          </h4>

          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-grab active:cursor-grabbing shrink-0"
            title="Drag to move"
          >
            <GripVertical size={13} />
          </button>
        </div>

        {/* Bottom Metadata Badges */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-center flex-wrap gap-2 text-gray-400 text-[11px]">
            {/* Due date */}
            {task.dueDate && <DueDateBadge dueDate={task.dueDate} />}

            {/* Has description icon */}
            {task.description && (
              <span
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600"
                title="This card has a description"
              >
                <AlignLeft size={12} />
              </span>
            )}

            {/* Subtask checklist progress */}
            {subtasks.length > 0 && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  completedSubtasks === subtasks.length
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Checklist items"
              >
                <CheckSquare size={11} />
                {completedSubtasks}/{subtasks.length}
              </span>
            )}
          </div>

          {/* Assignee Avatar */}
          {username ? (
            <div
              className="h-6 w-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0"
              title={`Assigned to ${username}`}
            >
              {username.charAt(0).toUpperCase()}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;