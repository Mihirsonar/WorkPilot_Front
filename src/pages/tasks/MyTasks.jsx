import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FolderKanban,
  Filter,
  Plus,
} from "lucide-react";

export default function MyTasks() {
  const [activeFilter, setActiveFilter] = useState("all");

  const sampleTasks = [
    {
      id: "1",
      title: "Review final UI assets for market launch",
      project: "Design Lab",
      status: "in_progress",
      dueDate: "Tomorrow",
      priority: "High",
      progress: 97,
      hours: "29/30h",
      assignee: "Olivia Bennett",
      role: "Product Manager",
    },
    {
      id: "2",
      title: "Coordinate user journey map updates",
      project: "Mobile App Redesign",
      status: "in_progress",
      dueDate: "Oct 24",
      priority: "Medium",
      progress: 87,
      hours: "35/40h",
      assignee: "Sophie Kim",
      role: "Project Lead",
    },
    {
      id: "3",
      title: "Prepare feature requirements & sprint backlog",
      project: "Design Lab",
      status: "todo",
      dueDate: "Oct 26",
      priority: "Medium",
      progress: 65,
      hours: "13/20h",
      assignee: "Maya Green",
      role: "Business Analyst",
    },
    {
      id: "4",
      title: "Refine interaction patterns for mobile onboarding",
      project: "Design System",
      status: "done",
      dueDate: "Yesterday",
      priority: "Low",
      progress: 100,
      hours: "19/20h",
      assignee: "Marcus Lee",
      role: "UI/Interaction Designer",
    },
  ];

  const filteredTasks = sampleTasks.filter((task) => {
    if (activeFilter === "all") return true;
    return task.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            My Tasks
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track and complete your assigned tasks across active workspaces.
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:shadow self-start sm:self-auto"
        >
          <FolderKanban size={15} />
          <span>Go to Workspaces</span>
        </Link>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-2">
        {[
          { id: "all", label: "All Tasks" },
          { id: "in_progress", label: "In Progress" },
          { id: "todo", label: "To Do" },
          { id: "done", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeFilter === tab.id
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-white border border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-xs"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TASK CARDS GRID (Inspired by reference screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-md">
                {task.project}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  task.status === "done"
                    ? "bg-emerald-50 text-emerald-700"
                    : task.status === "in_progress"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {task.status === "done"
                  ? "Completed"
                  : task.status === "in_progress"
                  ? "In Progress"
                  : "To Do"}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                {task.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                <Calendar size={13} />
                <span>Due {task.dueDate}</span>
              </p>
            </div>

            {/* Progress Bar matching reference image */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
                <span>Workload: {task.hours}</span>
                <span className="font-semibold text-gray-700">{task.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    task.status === "done"
                      ? "bg-emerald-500"
                      : task.progress > 80
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>

            {/* Member info matching screenshot card footer */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-[10px] font-bold">
                  {task.assignee.charAt(0)}
                </div>
                <span className="font-medium text-gray-700 text-xs">
                  {task.assignee}
                </span>
              </div>
              <span className="text-[11px] text-gray-400">{task.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}