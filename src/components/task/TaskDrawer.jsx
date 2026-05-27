import React, {
  useState,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateTask } from "../../services/task.services";

import { getProjectMembers } from "../../services/project.services.js";

import toast from "react-hot-toast";

import {
  X,
  CalendarDays,
  User2,
  FileText,
  CheckCircle2,
  CircleDashed,
  Activity,
  Search,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";

function TaskDrawer({
  task,
  onClose,
  projectId,
}) {
  const queryClient =
    useQueryClient();

  // MEMBERS
  const {
    data: members = [],
  } = useQuery({
    queryKey: [
      "members",
      projectId,
    ],

    queryFn: () =>
      getProjectMembers(
        projectId
      ),
  });

  // FORM STATE
  const [form, setForm] =
    useState({
      title: "",
      description: "",
      status: "todo",
      assignedTo: "",
      dueDate: "",
    });

  const [
    showAssigneeDropdown,
    setShowAssigneeDropdown,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  // LOAD TASK
  useEffect(() => {
    if (task) {
      setForm({
        title:
          task.title || "",

        description:
          task.description || "",

        status:
          task.status ||
          "todo",

        assignedTo:
          task.assignedTo?._id ||
          "",

        dueDate:
          task.dueDate
            ? task.dueDate.split(
                "T"
              )[0]
            : "",
      });
    }
  }, [task]);

  // UPDATE TASK
  const mutation =
    useMutation({
      mutationFn: updateTask,

      onMutate: async ({
        taskId,
        ...data
      }) => {
        await queryClient.cancelQueries(
          {
            queryKey: [
              "tasks",
              projectId,
            ],
          }
        );

        const previous =
          queryClient.getQueryData(
            [
              "tasks",
              projectId,
            ]
          );

        queryClient.setQueryData(
          ["tasks", projectId],
          (old = []) =>
            old.map((t) =>
              t._id === taskId
                ? {
                    ...t,
                    ...data,
                  }
                : t
            )
        );

        return { previous };
      },

      onError: (
        _,
        __,
        context
      ) => {
        queryClient.setQueryData(
          ["tasks", projectId],
          context.previous
        );

        toast.error(
          "Update failed"
        );
      },

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "tasks",
              projectId,
            ],
          }
        );

        toast.success(
          "Task updated 🚀"
        );

        onClose();
      },
    });

  // INPUT CHANGE
  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // SAVE
  const handleSave = () => {
    mutation.mutate({
      projectId,
      taskId: task._id,
      ...form,
    });
  };

  // FILTER MEMBERS
  const filteredMembers =
    members.filter((m) =>
      m.user.username
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (!task) return null;

  // STATUS COLORS
  const statusStyles = {
    todo: {
      label: "Todo",

      icon: (
        <CircleDashed
          size={16}
        />
      ),

      className:
        "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
    },

    in_progress: {
      label: "In Progress",

      icon: (
        <Activity size={16} />
      ),

      className:
        "bg-orange-500/10 text-orange-300 border border-orange-500/20",
    },

    done: {
      label: "Completed",

      icon: (
        <CheckCircle2
          size={16}
        />
      ),

      className:
        "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    },
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      />

      {/* DRAWER */}
      <motion.div
        initial={{
          x: "100%",
        }}
        animate={{ x: 0 }}
        exit={{
          x: "100%",
        }}
        transition={{
          duration: 0.35,
        }}
        className="fixed right-0 top-0 z-50 h-full w-full sm:w-[720px] border-l border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40 flex flex-col overflow-y-auto"
      >
        {/* HEADER */}
        <div className="relative overflow-hidden border-b border-white/10 p-6">
          {/* Glow */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 flex items-start justify-between gap-5">
            {/* LEFT */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles
                  size={16}
                  className="text-indigo-300"
                />

                <span className="text-sm text-indigo-300 font-medium">
                  Task Details
                </span>
              </div>

              {/* TITLE */}
              <input
                name="title"
                value={form.title}
                onChange={
                  handleChange
                }
                className="w-full bg-transparent text-4xl font-bold text-white outline-none placeholder:text-slate-500"
                placeholder="Untitled Task"
              />

              <p className="text-slate-400 mt-3">
                Manage task
                details, assignees
                and workflow status.
              </p>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 space-y-8">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ASSIGNEE */}
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <User2
                  size={16}
                  className="text-cyan-400"
                />

                Assignee
              </label>

              <div
                onClick={() =>
                  setShowAssigneeDropdown(
                    !showAssigneeDropdown
                  )
                }
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:border-indigo-500/30 transition-all duration-300"
              >
                {form.assignedTo ? (
                  (() => {
                    const selectedUser =
                      members.find(
                        (m) =>
                          m.user
                            ._id ===
                          form.assignedTo
                      )?.user;

                    return (
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-semibold">
                          {selectedUser?.username
                            ?.charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div>
                          <h4 className="text-white font-medium">
                            {
                              selectedUser?.username
                            }
                          </h4>

                          <p className="text-sm text-slate-400">
                            {
                              selectedUser?.email
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-slate-500">
                    Unassigned
                  </span>
                )}
              </div>

              {/* DROPDOWN */}
              {showAssigneeDropdown && (
                <div className="absolute top-[105%] left-0 w-full rounded-3xl border border-white/10 bg-[#111827] shadow-2xl p-4 z-50">
                  {/* SEARCH */}
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 mb-4">
                    <Search
                      size={16}
                      className="text-slate-500"
                    />

                    <input
                      type="text"
                      placeholder="Search members..."
                      value={search}
                      onChange={(
                        e
                      ) =>
                        setSearch(
                          e.target
                            .value
                        )
                      }
                      className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
                    />
                  </div>

                  {/* MEMBERS */}
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {filteredMembers.map(
                      (m) => {
                        const user =
                          m.user;

                        const isSelected =
                          form.assignedTo ===
                          user._id;

                        return (
                          <div
                            key={
                              user._id
                            }
                            onClick={() => {
                              setForm(
                                {
                                  ...form,
                                  assignedTo:
                                    user._id,
                                }
                              );

                              setShowAssigneeDropdown(
                                false
                              );
                            }}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? "bg-indigo-500/10 border border-indigo-500/20"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-semibold">
                              {user.username
                                ?.charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">
                                {
                                  user.username
                                }
                              </span>

                              <span className="text-xs text-slate-500">
                                {user.email ||
                                  ""}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Activity
                  size={16}
                  className="text-orange-400"
                />

                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={
                  handleChange
                }
                className={`w-full rounded-2xl px-5 py-4 outline-none bg-[#111827] ${statusStyles[form.status].className}`}
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

            {/* DUE DATE */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <CalendarDays
                  size={16}
                  className="text-emerald-400"
                />

                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={
                  handleChange
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none focus:border-indigo-500/40 transition-all duration-300"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <FileText
                size={16}
                className="text-indigo-400"
              />

              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={
                handleChange
              }
              placeholder="Write task details..."
              className="w-full min-h-[220px] rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-5 text-white outline-none resize-none placeholder:text-slate-500 focus:border-indigo-500/40 transition-all duration-300"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-slate-300 hover:bg-white/10 transition-all duration-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={
              mutation.isPending
            }
            className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={18} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default TaskDrawer;