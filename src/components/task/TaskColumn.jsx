import React from 'react'
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

function TaskColumn({ id, title, tasks = [] }) {
  const { setNodeRef,isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 p-4 rounded-lg min-h-[400px] transition ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}
    >
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;