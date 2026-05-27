import React, { useState } from "react";

import {
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProjectTasks,
  updateTask,
} from "../../services/task.services.js";

import TaskColumn from "./TaskColumn";
import TaskDrawer from "./TaskDrawer.jsx";

import {
  CircleDashed,
  Loader2,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react";

function TaskBoard({ projectId }) {
  const [activeTask, setActiveTask] =
    useState(null);

  const [selectedTask, setSelectedTask] =
    useState(null);

  // FETCH TASKS
  const {
    data: tasks = [],
    isLoading,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () =>
      getProjectTasks(projectId),
  });

  const queryClient = useQueryClient();

  // UPDATE TASK STATUS
  const mutation = useMutation({
    mutationFn: updateTask,

    onMutate: async ({
      taskId,
      status,
    }) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId],
      });

      const previousTasks =
        queryClient.getQueryData([
          "tasks",
          projectId,
        ]);

      queryClient.setQueryData(
        ["tasks", projectId],
        (old = []) =>
          old.map((task) =>
            String(task._id) ===
            String(taskId)
              ? {
                  ...task,
                  status,
                }
              : task
          )
      );

      return { previousTasks };
    },

    onError: (
      err,
      variables,
      context
    ) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        context.previousTasks
      );
    },
  });

  // DRAG START
  const handleDragStart = (
    event
  ) => {
    const task = tasks.find(
      (t) =>
        String(t._id) ===
        String(event.active.id)
    );

    setActiveTask(task);
  };

  // DRAG END
  const handleDragEnd = (
    event
  ) => {
    const { active, over } =
      event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;

    let newStatus = over.id;

    const overTask = tasks.find(
      (t) =>
        String(t._id) ===
        String(over.id)
    );

    if (overTask) {
      newStatus = overTask.status;
    }

    const validStatuses = [
      "todo",
      "in_progress",
      "done",
    ];

    if (
      !validStatuses.includes(newStatus)
    )
      return;

    const task = tasks.find(
      (t) =>
        String(t._id) ===
        String(taskId)
    );

    if (!task) return;

    if (task.status !== newStatus) {
      mutation.mutate({
        projectId,
        taskId,
        status: newStatus,
      });
    }
  };

  // DRAG CANCEL
  const handleDragCancel = () => {
    setActiveTask(null);
  };

  // TASK COLUMNS
  const columns = {
    todo: tasks.filter(
      (t) => t.status === "todo"
    ),

    in_progress: tasks.filter(
      (t) =>
        t.status === "in_progress"
    ),

    done: tasks.filter(
      (t) => t.status === "done"
    ),
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />

        <p className="mt-5 text-slate-400 text-lg">
          Loading tasks board...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* TODO */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
          <div className="absolute top-0 right-0 h-28 w-28 bg-indigo-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Todo Tasks
              </p>

              <h2 className="text-4xl font-bold text-white mt-2">
                {columns.todo.length}
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <CircleDashed
                size={26}
                className="text-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
          <div className="absolute top-0 right-0 h-28 w-28 bg-orange-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                In Progress
              </p>

              <h2 className="text-4xl font-bold text-white mt-2">
                {
                  columns.in_progress
                    .length
                }
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Activity
                size={26}
                className="text-orange-400"
              />
            </div>
          </div>
        </div>

        {/* DONE */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
          <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Completed
              </p>

              <h2 className="text-4xl font-bold text-white mt-2">
                {columns.done.length}
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2
                size={26}
                className="text-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles
              size={18}
              className="text-indigo-400"
            />

            <span className="text-indigo-300 text-sm font-medium">
              Smart Workflow
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white">
            Kanban Task Board
          </h2>

          <p className="text-slate-400 mt-2">
            Drag & drop tasks between
            columns to update progress.
          </p>
        </div>

        {/* STATUS */}
        {mutation.isPending && (
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-indigo-300">
            <Loader2
              size={18}
              className="animate-spin"
            />

            Updating task...
          </div>
        )}
      </div>

      {/* BOARD */}
      <DndContext
        collisionDetection={
          closestCorners
        }
        onDragStart={
          handleDragStart
        }
        onDragEnd={handleDragEnd}
        onDragCancel={
          handleDragCancel
        }
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* TODO */}
          <TaskColumn
            id="todo"
            title="Todo"
            tasks={columns.todo}
            activeTask={activeTask}
            onTaskClick={
              setSelectedTask
            }
          />

          {/* IN PROGRESS */}
          <TaskColumn
            id="in_progress"
            title="In Progress"
            tasks={
              columns.in_progress
            }
            activeTask={activeTask}
            onTaskClick={
              setSelectedTask
            }
          />

          {/* DONE */}
          <TaskColumn
            id="done"
            title="Done"
            tasks={columns.done}
            activeTask={activeTask}
            onTaskClick={
              setSelectedTask
            }
          />
        </div>

        {/* DRAG OVERLAY */}
        <DragOverlay>
          {activeTask && (
            <div className="w-[280px] rounded-3xl border border-indigo-500/30 bg-[#111827] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl rotate-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                  <CircleDashed
                    size={20}
                    className="text-indigo-400"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Dragging Task
                  </p>

                  <h3 className="text-white font-semibold">
                    {
                      activeTask.title
                    }
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-400 line-clamp-3">
                {
                  activeTask.description
                }
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* TASK DRAWER */}
      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          projectId={projectId}
          onClose={() =>
            setSelectedTask(null)
          }
        />
      )}
    </>
  );
}

export default TaskBoard;