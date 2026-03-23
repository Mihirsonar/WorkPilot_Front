import React from 'react'
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {motion} from 'framer-motion';

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(task._id)
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      whileHover={{scale:1.04}}
      whileTap={{scale:0.97}}
      className="bg-white p-3 rounded shadow cursor-grab active:cursor-grabbing transition-transform duration-100"
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
        
    </motion.div>
  );
}

export default TaskCard;