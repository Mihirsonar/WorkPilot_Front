import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import {
  X,
  FolderKanban,
  FileText,
  Sparkles,
} from "lucide-react";

function CreateProjectModel({ onClose, onCreate, isLoading: isCreating }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <FolderKanban size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Create Project Workspace
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Set up a new board and organize team sprints.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* PROJECT NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Project Name *
            </label>
            <input
              placeholder="e.g. Design Lab, Mobile Redesign..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5 transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Describe your workspace goals and priorities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none resize-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5 transition"
            />
          </div>

          {/* INVITE HINT */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">
              You can invite team members after creating the project using <span className="font-semibold text-gray-700">invite links</span>.
            </p>
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateProjectModel;