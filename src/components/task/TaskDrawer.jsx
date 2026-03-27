import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../services/task.services";
import toast from "react-hot-toast";

function TaskDrawer({ task, onClose, projectId }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: ""
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo"
      });
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: updateTask,

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId]
      });

      const previous = queryClient.getQueryData([
        "tasks",
        projectId
      ]);

      queryClient.setQueryData(
        ["tasks", projectId],
        (old = []) =>
          old.map((t) =>
            t._id === taskId ? { ...t, ...data } : t
          )
      );

      return { previous };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        context.previous
      );
      toast.error("Update failed");
    },

    onSuccess: () => {
      toast.success("Task updated");
    }
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    mutation.mutate({
      projectId,
      taskId: task._id,
      data: form
    });
    onClose();
  };

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
        className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-xl p-6 flex flex-col"
      >

        <h2 className="text-xl font-semibold mb-4">
          Task Details
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="mt-auto flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border p-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white p-2 rounded"
          >
            Save
          </button>
        </div>

      </motion.div>
    </>
  );
}

export default TaskDrawer;