import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/task.services.js";
import { getProjectMembers } from "../../services/project.services.js";
import toast from "react-hot-toast";
import {
  X,
  Plus,
  Loader2,
  CheckSquare,
} from "lucide-react";

function CreateTaskModel({ projectId, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [assignedTo, setAssignedTo] = useState("");

  const queryClient = useQueryClient();

  const { data: membersRaw = [], isLoading } = useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getProjectMembers(projectId),
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  });

  // Normalize members into a flat list with _id and username
  const users = membersRaw.map((m) => ({
    _id: m.user?._id || m._id,
    username: m.user?.username || m.username,
  }));

  const mutation = useMutation({
    mutationFn: ({ projectId, ...taskData }) =>
      createTask({ projectId, ...taskData }),
    onSuccess: () => {
      toast.success("Task created successfully 🚀");
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to create task");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignedTo) {
      toast.error("Please assign task to a team member");
      return;
    }

    mutation.mutate({
      projectId,
      title,
      description,
      status,
      assignedTo,
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
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Create New Task
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Add a task card to your project sprint board.
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
          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Design user journey mapping..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5 transition"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Describe requirements, deliverables, or checklist items..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none resize-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5 transition"
            />
          </div>

          {/* STATUS & ASSIGNEE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* STATUS */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            {/* ASSIGNEE */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Assignee *
              </label>
              {isLoading ? (
                <div className="text-xs text-gray-400 py-2.5">
                  Loading team members...
                </div>
              ) : (
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition"
                >
                  <option value="">Select Assignee</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
              disabled={mutation.isPending || !title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateTaskModel;