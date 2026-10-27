import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTask,
  deleteTask,
  getTaskById,
} from "../../services/task.services";
import { getProjectMembers } from "../../services/project.services.js";
import toast from "react-hot-toast";
import {
  X,
  CalendarDays,
  User2,
  AlignLeft,
  Search,
  Save,
  Loader2,
  Trash2,
  CheckCircle2,
  Clock,
  Layout,
} from "lucide-react";
import LabelPicker from "../card/LabelPicker.jsx";
import CoverColorPicker from "../card/CoverColorPicker.jsx";
import ChecklistSection from "../card/ChecklistSection.jsx";
import CommentSection from "../card/CommentSection.jsx";

function TaskDrawer({ task: initialTask, onClose, projectId }) {
  const queryClient = useQueryClient();
  const taskId = initialTask?._id;

  const { data: task = initialTask, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    initialData: initialTask,
    enabled: !!taskId,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assignedTo: "",
    dueDate: "",
    labels: [],
    coverColor: "",
    list: "",
  });

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        assignedTo:
          typeof task.assignedTo === "object"
            ? task.assignedTo?._id
            : task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        labels: task.labels || [],
        coverColor: task.coverColor || "",
        list: task.list?._id || task.list || "",
      });
    }
  }, [task]);

  const updateMutation = useMutation({
    mutationFn: (updates) =>
      updateTask({
        projectId,
        taskId,
        ...updates,
      }),
    onSuccess: (updated) => {
      if (updated) {
        queryClient.setQueryData(["task", taskId], updated);
        queryClient.setQueryData(["tasks", projectId], (oldTasks) => {
          if (!oldTasks || !Array.isArray(oldTasks)) return oldTasks;
          return oldTasks.map((t) =>
            t._id === taskId ? { ...t, ...updated } : t
          );
        });
      }
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success("Card updated");
    },
    onError: () => toast.error("Failed to update card"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask({ projectId, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Card deleted");
      onClose();
    },
    onError: () => toast.error("Failed to delete card"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAll = () => {
    const payload = {
      ...form,
      assignedTo: form.assignedTo ? form.assignedTo : null,
      dueDate: form.dueDate ? form.dueDate : null,
    };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleLabelsChange = (newLabels) => {
    setForm((prev) => ({ ...prev, labels: newLabels }));
    updateMutation.mutate({ labels: newLabels });
  };

  const handleCoverColorChange = (newColor) => {
    setForm((prev) => ({ ...prev, coverColor: newColor }));
    updateMutation.mutate({ coverColor: newColor });
  };

  const filteredMembers = members.filter((m) =>
    (m.user?.username || "")
      .toLowerCase()
      .includes(memberSearch.toLowerCase())
  );

  const selectedMember = members.find(
    (m) => String(m.user?._id) === String(form.assignedTo)
  )?.user;

  if (!task) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white border-l border-gray-200 shadow-2xl flex flex-col overflow-hidden text-gray-900"
      >
        {/* Cover Banner if selected */}
        {form.coverColor && (
          <div
            className="h-20 w-full transition-all relative shrink-0"
            style={{ backgroundColor: form.coverColor }}
          >
            <button
              onClick={() => handleCoverColorChange("")}
              className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/50 hover:bg-black/70 text-white text-[11px] font-medium transition"
            >
              Remove Cover
            </button>
          </div>
        )}

        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-gray-400">
                <Layout size={13} />
                <span>
                  in list{" "}
                  <span className="text-gray-700 underline font-bold">
                    {task.list?.title || "Board List"}
                  </span>
                </span>
              </div>

              {/* Title Input */}
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={() => {
                  if (form.title !== task.title) {
                    updateMutation.mutate({ title: form.title });
                  }
                }}
                className="w-full bg-transparent text-xl font-bold text-gray-900 outline-none focus:ring-1 focus:ring-gray-900 rounded-lg px-1 -mx-1"
                placeholder="Card title..."
              />
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Actions / Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Assignee
              </label>
              <div
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-100/70 p-2.5 transition flex items-center justify-between"
              >
                {selectedMember ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">
                      {selectedMember.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-gray-900 truncate">
                      {selectedMember.username}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Unassigned</span>
                )}
                <span className="text-xs text-gray-600 font-semibold">Change</span>
              </div>

              {showAssigneeDropdown && (
                <div className="absolute top-[105%] left-0 w-full rounded-2xl border border-gray-200 bg-white shadow-xl p-2.5 z-50 space-y-1">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 mb-1">
                    <Search size={13} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full bg-transparent outline-none text-xs text-gray-900"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                    <div
                      onClick={() => {
                        setForm((prev) => ({ ...prev, assignedTo: "" }));
                        updateMutation.mutate({ assignedTo: null });
                        setShowAssigneeDropdown(false);
                      }}
                      className="p-2 rounded-lg text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      None (Unassign)
                    </div>
                    {filteredMembers.map((m) => (
                      <div
                        key={m.user?._id}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            assignedTo: m.user._id,
                          }));
                          updateMutation.mutate({ assignedTo: m.user._id });
                          setShowAssigneeDropdown(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-lg text-xs hover:bg-gray-50 cursor-pointer text-gray-800"
                      >
                        <div className="h-5 w-5 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[9px]">
                          {m.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{m.user?.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={(e) => {
                  handleChange(e);
                  updateMutation.mutate({ dueDate: e.target.value });
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-100/70 px-3 py-2 text-xs text-gray-900 outline-none focus:border-gray-900 transition cursor-pointer"
              />
            </div>
          </div>

          {/* Labels Section */}
          <div className="border-t border-gray-100 pt-4">
            <LabelPicker
              selectedLabels={form.labels}
              onChange={handleLabelsChange}
            />
          </div>

          {/* Cover Color Picker */}
          <div className="border-t border-gray-100 pt-4">
            <CoverColorPicker
              coverColor={form.coverColor}
              onChange={handleCoverColorChange}
            />
          </div>

          {/* Description Section */}
          <div className="border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
              <AlignLeft size={14} className="text-gray-500" />
              <span>Description</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={() => {
                if (form.description !== task.description) {
                  updateMutation.mutate({
                    description: form.description,
                  });
                }
              }}
              rows={4}
              placeholder="Add more details, links, or specifications..."
              className="w-full bg-gray-50/70 border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl p-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none resize-none transition leading-relaxed"
            />
          </div>

          {/* Checklist Section */}
          <div className="border-t border-gray-100 pt-4">
            <ChecklistSection
              projectId={projectId}
              taskId={taskId}
              subtasks={task.subtasks || []}
            />
          </div>

          {/* Comments & Activity Section */}
          <div className="border-t border-gray-100 pt-4">
            <CommentSection
              projectId={projectId}
              taskId={taskId}
            />
          </div>
        </div>

        {/* Drawer Footer with Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${task.title}"?`
                )
              ) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition disabled:opacity-50"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={handleSaveAll}
              disabled={updateMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-70 text-white text-xs font-semibold shadow-xs transition"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TaskDrawer;