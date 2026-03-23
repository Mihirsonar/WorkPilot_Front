import { useState}from "react";
import React from "react";
import { motion } from "framer-motion";
import { createProject } from "../../services/createProject.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function CreateProjectModel({ onClose }) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      toast.success("Project created successfully");

      queryClient.invalidateQueries(["projects"]);

      onClose();
    },

    onError: () => {
      toast.error("Failed to create project");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      name,
      description
    });
  };

  return (
  
 <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"> 

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-xl font-semibold mb-4">
          Create Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

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

export default CreateProjectModel;