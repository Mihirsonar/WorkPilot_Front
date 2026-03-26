import React from 'react'
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function TaskColumn({ id, title, tasks = [], activeTask, onTaskClick }) {

  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg min-h-[400px] transition 
        ${isOver ? "bg-indigo-100" : "bg-gray-100"}`}
    >
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isDragging={activeTask?._id === task._id}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}
export default TaskColumn;