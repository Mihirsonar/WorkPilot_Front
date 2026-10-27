import React, { useState } from "react";
import { CheckSquare, Plus, Trash2, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../../services/task.services.js";
import toast from "react-hot-toast";

function ChecklistSection({ projectId, taskId, subtasks = [], onUpdate }) {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const total = subtasks.length;
  const completed = subtasks.filter((s) => s.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Add subtask mutation
  const addMutation = useMutation({
    mutationFn: (title) => createSubTask({ projectId, taskId, title }),
    onSuccess: (newSubtask) => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      setNewTitle("");
      setIsAdding(false);
      toast.success("Item added");
    },
    onError: () => toast.error("Failed to add checklist item"),
  });

  // Toggle subtask mutation
  const toggleMutation = useMutation({
    mutationFn: ({ subTaskId, isCompleted }) =>
      updateSubTask({ projectId, taskId, subTaskId, isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
    onError: () => toast.error("Failed to update item"),
  });

  // Delete subtask mutation
  const deleteMutation = useMutation({
    mutationFn: (subTaskId) =>
      deleteSubTask({ projectId, taskId, subTaskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Item deleted");
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMutation.mutate(newTitle.trim());
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <CheckSquare size={15} className="text-gray-500" />
          <span>Checklist</span>
        </div>
        <span className="text-[11px] font-medium text-gray-400">
          {completed}/{total} ({percentage}%)
        </span>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              percentage === 100
                ? "bg-emerald-500"
                : "bg-gray-900"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Items list */}
      <div className="space-y-1.5">
        {subtasks.map((item) => (
          <div
            key={item._id}
            className="group flex items-center justify-between gap-3 p-2 rounded-xl bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200/80 transition"
          >
            <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
              <button
                type="button"
                onClick={() =>
                  toggleMutation.mutate({
                    subTaskId: item._id,
                    isCompleted: !item.isCompleted,
                  })
                }
                className={`h-4.5 w-4.5 rounded-md flex items-center justify-center border transition ${
                  item.isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-gray-300 bg-white hover:border-gray-900"
                }`}
              >
                {item.isCompleted && <Check size={11} strokeWidth={3} />}
              </button>
              <span
                className={`text-xs select-none break-words ${
                  item.isCompleted
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {item.title}
              </span>
            </label>

            <button
              type="button"
              onClick={() => deleteMutation.mutate(item._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-600 p-1 rounded-md transition"
              title="Delete item"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item Composer */}
      {isAdding ? (
        <form onSubmit={handleAdd} className="space-y-2 mt-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add an item..."
            autoFocus
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={addMutation.isPending || !newTitle.trim()}
              className="px-3 py-1 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold transition"
            >
              {addMutation.isPending ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTitle("");
              }}
              className="px-3 py-1 rounded-xl text-gray-400 hover:text-gray-700 text-xs transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 py-1.5 px-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Plus size={13} />
          <span>Add an item</span>
        </button>
      )}
    </div>
  );
}

export default ChecklistSection;
