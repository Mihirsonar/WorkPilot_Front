import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../../services/task.services.js';
import { getUsers } from '../../services/project.services.js'
import toast from 'react-hot-toast';

function CreateTaskModel({ projectId, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [assignedTo, setAssignedTo] = useState("");

  const queryClient = useQueryClient();

  // ✅ Fetch users using your service
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5 // ✅ cache for 5 min
  });

  // ✅ Mutation
  const mutation = useMutation({
    mutationFn: ({ projectId, ...taskData }) =>
      createTask(projectId, taskData),

    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
    },

    onError: (err) => {
      console.error(err);
      toast.error("Failed to create task");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assignedTo) {
      toast.error("Please assign task to a user");
      return;
    }

    mutation.mutate({
      projectId,
      title,
      description,
      status,
      assignedTo
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* ✅ Assign User */}
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading users...</div>
          ) : (
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Assignee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}

export default CreateTaskModel;