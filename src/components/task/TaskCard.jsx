import React from 'react'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

function TaskCard({ task, isDragging, onClick }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: String(task._id)
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      whileHover={{ scale: 1.03 }}
      className="bg-white p-3 rounded shadow flex justify-between items-center"
    >

      {/* Clickable Content */}
      <div className="flex-1 cursor-pointer">
        <h4 className="font-medium">{task.title}</h4>
      </div>

      {/* Drag Handle ONLY */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab px-2 text-gray-400"
      >
        ⋮
      </div>

      {task.assignedTo && (
  <div className="mt-2 flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
      {task.assignedTo.username?.charAt(0)}
    </div>
    <span className="text-xs text-gray-500">
      {task.assignedTo.username}
    </span>
  </div>
)}

    </motion.div>
  );
}

export default TaskCard;