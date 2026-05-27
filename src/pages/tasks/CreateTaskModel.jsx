import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createTask } from "../../services/task.services.js";
import { getUsers } from "../../services/project.services.js";

import toast from "react-hot-toast";

import {
  X,
  Plus,
  FileText,
  ListTodo,
  User2,
  Loader2,
  Sparkles,
} from "lucide-react";

function CreateTaskModel({ projectId, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] = useState("todo");
  const [assignedTo, setAssignedTo] =
    useState("");

  const queryClient = useQueryClient();

  // FETCH USERS
  const { data: users = [], isLoading } =
    useQuery({
      queryKey: ["users"],
      queryFn: getUsers,
      staleTime: 1000 * 60 * 5,
    });

  // CREATE TASK
  const mutation = useMutation({
    mutationFn: ({ projectId, ...taskData }) =>
      createTask(projectId, taskData),

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

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assignedTo) {
      toast.error(
        "Please assign task to a user"
      );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 h-52 w-52 bg-indigo-500/20 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="relative z-10 flex items-start justify-between border-b border-white/10 p-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Plus
                size={28}
                className="text-indigo-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  size={16}
                  className="text-indigo-300"
                />

                <span className="text-sm text-indigo-300 font-medium">
                  Task Management
                </span>
              </div>

              <h2 className="text-3xl font-bold text-white">
                Create New Task
              </h2>

              <p className="text-slate-400 mt-2">
                Add a task, assign members and
                organize your workflow efficiently.
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 p-6 space-y-6"
        >
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <ListTodo
                size={16}
                className="text-indigo-400"
              />

              Task Title
            </label>

            <input
              type="text"
              placeholder="Design modern dashboard UI..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all duration-300"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <FileText
                size={16}
                className="text-cyan-400"
              />

              Description
            </label>

            <textarea
              placeholder="Describe the task details..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-500 outline-none resize-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all duration-300"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* STATUS */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <ListTodo
                  size={16}
                  className="text-orange-400"
                />

                Task Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none focus:border-indigo-500/50 transition-all duration-300"
              >
                <option value="todo">
                  Todo
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>
            </div>

            {/* ASSIGNEE */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <User2
                  size={16}
                  className="text-emerald-400"
                />

                Assign User
              </label>

              {isLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-400">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Loading users...
                </div>
              ) : (
                <select
                  value={assignedTo}
                  onChange={(e) =>
                    setAssignedTo(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none focus:border-indigo-500/50 transition-all duration-300"
                >
                  <option value="">
                    Select Assignee
                  </option>

                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.username}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />

                  Create Task
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