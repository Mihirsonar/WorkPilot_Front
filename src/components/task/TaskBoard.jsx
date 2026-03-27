import React from "react";
import {
  DndContext,
  closestCorners,
  DragOverlay
} from "@dnd-kit/core";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectTasks, updateTask } from "../../services/task.services.js";
import TaskColumn from "./TaskColumn";
import TaskDrawer from "./TaskDrawer.jsx";

function TaskBoard({ projectId }) {

  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId)
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateTask,

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId]
      });

      const previousTasks = queryClient.getQueryData([
        "tasks",
        projectId
      ]);

      queryClient.setQueryData(
        ["tasks", projectId],
        (old = []) =>
          old.map((task) =>
            String(task._id) === String(taskId)
              ? { ...task, status }
              : task
          )
      );

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        context.previousTasks
      );
    }
  });

  const handleDragStart = (event) => {
    const task = tasks.find(
      (t) => String(t._id) === String(event.active.id)
    );
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;

    let newStatus = over.id;

    const overTask = tasks.find(
      (t) => String(t._id) === String(over.id)
    );

    if (overTask) {
      newStatus = overTask.status;
    }

    const validStatuses = ["todo", "in_progress", "done"];

    if (!validStatuses.includes(newStatus)) return;

    const task = tasks.find(
      (t) => String(t._id) === String(taskId)
    );

    if (!task) return;

    if (task.status !== newStatus) {
      mutation.mutate({
        projectId,
        taskId,
        status: newStatus
      });
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done")
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-3 gap-6">
          <TaskColumn
            id="todo"
            title="Todo"
            tasks={columns.todo}
            activeTask={activeTask}
            onTaskClick={setSelectedTask}
          />

          <TaskColumn
            id="in_progress"
            title="In Progress"
            tasks={columns.in_progress}
            activeTask={activeTask}
            onTaskClick={setSelectedTask}
          />

          <TaskColumn
            id="done"
            title="Done"
            tasks={columns.done}
            activeTask={activeTask}
            onTaskClick={setSelectedTask}
          />
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white p-3 rounded shadow-lg w-[200px] opacity-90">
              {activeTask.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          projectId={projectId}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}

export default TaskBoard;