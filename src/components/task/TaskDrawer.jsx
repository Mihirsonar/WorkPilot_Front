import { motion } from "framer-motion";
import React from "react";

function TaskDrawer({ task, onClose }) {

  if (!task) return null;

  return (
    <>
   
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

    
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-xl p-6 flex flex-col"
      >

        <h2 className="text-xl font-semibold mb-4">
          Task Details
        </h2>

      
        <div className="mb-4">
          <label className="text-sm text-gray-500">Title</label>
          <input
            value={task.title}
            readOnly
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-500">Description</label>
          <textarea
            value={task.description || ""}
            readOnly
            className="w-full border p-2 rounded mt-1"
          />
        </div>

   
        <div className="mb-4">
          <label className="text-sm text-gray-500">Status</label>
          <input
            value={task.status}
            readOnly
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button
          onClick={onClose}
          className="mt-auto bg-gray-200 p-2 rounded"
        >
          Close
        </button>

      </motion.div>
    </>
  );
}

export default TaskDrawer;