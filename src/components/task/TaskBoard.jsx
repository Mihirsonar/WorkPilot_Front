import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProjectTasks,
  updateTask,
  reorderTasks,
} from "../../services/task.services.js";
import {
  getProjectLists,
  createList,
} from "../../services/list.service.js";
import TaskColumn from "./TaskColumn";
import TaskDrawer from "./TaskDrawer.jsx";
import {
  Search,
  Plus,
  X,
  Filter,
  CheckCircle2,
  Kanban,
  Layers,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

function TaskBoard({ projectId }) {
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Add list state
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const queryClient = useQueryClient();

  // Sensors for smooth dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // FETCH LISTS
  const {
    data: lists = [],
    isLoading: isLoadingLists,
  } = useQuery({
    queryKey: ["lists", projectId],
    queryFn: () => getProjectLists(projectId),
    enabled: !!projectId,
  });

  // FETCH TASKS
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
  });

  // CREATE LIST MUTATION
  const createListMutation = useMutation({
    mutationFn: (title) => createList({ projectId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", projectId] });
      setNewListTitle("");
      setIsAddingList(false);
      toast.success("List created");
    },
    onError: () => toast.error("Failed to create list"),
  });

  // REORDER / MOVE TASK MUTATION
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // Filter tasks based on search & filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Keyword search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = t.title?.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }
      // Label filter
      if (selectedLabel) {
        const hasLabel = t.labels?.some((l) => l.name === selectedLabel);
        if (!hasLabel) return false;
      }
      // Member filter
      if (selectedMemberId) {
        const memberId =
          typeof t.assignedTo === "object"
            ? t.assignedTo?._id
            : t.assignedTo;
        if (String(memberId) !== String(selectedMemberId)) return false;
      }
      return true;
    });
  }, [tasks, searchTerm, selectedLabel, selectedMemberId]);

  // Group filtered tasks by list ID
  const tasksByList = useMemo(() => {
    const map = {};
    lists.forEach((l) => {
      map[String(l._id)] = [];
    });

    filteredTasks.forEach((task) => {
      const listId =
        typeof task.list === "object" ? task.list?._id : task.list;
      const key = String(listId || (lists[0] ? lists[0]._id : ""));
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });

    // Sort tasks in each list by position
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (a.position || 0) - (b.position || 0));
    });

    return map;
  }, [lists, filteredTasks]);

  // Collect distinct labels across all tasks for the filter bar
  const allLabels = useMemo(() => {
    const set = new Map();
    tasks.forEach((t) => {
      (t.labels || []).forEach((l) => {
        if (l.name && !set.has(l.name)) {
          set.set(l.name, l.color || "#6366f1");
        }
      });
    });
    return Array.from(set.entries()).map(([name, color]) => ({ name, color }));
  }, [tasks]);

  // DRAG HANDLERS
  const handleDragStart = (event) => {
    const task = tasks.find((t) => String(t._id) === String(event.active.id));
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const draggedTask = tasks.find((t) => String(t._id) === activeTaskId);
    if (!draggedTask) return;

    // Determine target list
    let targetListId = null;
    let targetPosition = 0;

    // Is over a column directly?
    const overList = lists.find((l) => String(l._id) === overId);
    if (overList) {
      targetListId = String(overList._id);
      const listCards = tasksByList[targetListId] || [];
      targetPosition = listCards.length;
    } else {
      // Over another card
      const overCard = tasks.find((t) => String(t._id) === overId);
      if (overCard) {
        targetListId = String(
          typeof overCard.list === "object"
            ? overCard.list?._id
            : overCard.list
        );
        targetPosition = overCard.position || 0;
      }
    }

    if (!targetListId) return;

    const currentListId = String(
      typeof draggedTask.list === "object"
        ? draggedTask.list?._id
        : draggedTask.list
    );

    // If moved to a different list or position
    if (currentListId !== targetListId || draggedTask.position !== targetPosition) {
      // Optimistic update
      queryClient.setQueryData(["tasks", projectId], (old = []) =>
        old.map((t) =>
          String(t._id) === activeTaskId
            ? { ...t, list: targetListId, position: targetPosition }
            : t
        )
      );

      // Persist to backend
      updateTaskMutation.mutate({
        projectId,
        taskId: activeTaskId,
        list: targetListId,
        position: targetPosition,
      });
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    createListMutation.mutate(newListTitle.trim());
  };

  // Stats calculation
  const totalCards = tasks.length;
  const completedCards = tasks.filter((t) => {
    const listTitle =
      typeof t.list === "object" ? t.list?.title?.toLowerCase() : "";
    return t.status === "done" || listTitle?.includes("done");
  }).length;

  if (isLoadingLists || isLoadingTasks) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-gray-500">
        <div className="h-8 w-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
        <p className="mt-3 text-xs font-medium text-gray-500">
          Loading Kanban board...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* BOARD CONTROLS / TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-200/80">
        {/* Left: Search & Filter Chips */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 focus-within:border-gray-900 transition-all w-60 shadow-xs">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter cards..."
              className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Label Filter Pills */}
          {allLabels.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
                <Filter size={12} />
                Labels:
              </span>
              {allLabels.map((lbl) => {
                const isSelected = selectedLabel === lbl.name;
                return (
                  <button
                    key={lbl.name}
                    onClick={() =>
                      setSelectedLabel(isSelected ? "" : lbl.name)
                    }
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg transition-all ${
                      isSelected
                        ? "ring-2 ring-gray-900 text-white shadow-xs"
                        : "opacity-80 hover:opacity-100 text-white"
                    }`}
                    style={{ backgroundColor: lbl.color }}
                  >
                    {lbl.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Reset Filters */}
          {(searchTerm || selectedLabel) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLabel("");
              }}
              className="text-xs text-gray-500 hover:text-gray-900 hover:underline px-2 py-1 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Right: Board Stats */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-gray-200/80 shadow-xs">
            <Layers size={13} className="text-gray-600" />
            <span>{lists.length} Lists</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-gray-200/80 shadow-xs">
            <Kanban size={13} className="text-blue-600" />
            <span>{totalCards} Cards</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-gray-200/80 shadow-xs">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>{completedCards} Done</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL BOARD CANVAS */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="inline-flex items-start gap-4 h-full pr-8">
            {/* Dynamic Lists */}
            {lists.map((list) => (
              <TaskColumn
                key={list._id}
                list={list}
                tasks={tasksByList[String(list._id)] || []}
                activeTask={activeTask}
                onTaskClick={setSelectedTask}
                projectId={projectId}
              />
            ))}

            {/* Add Another List Composer */}
            <div className="w-72 shrink-0">
              {isAddingList ? (
                <form
                  onSubmit={handleAddList}
                  className="rounded-2xl border border-gray-300 bg-white p-3.5 space-y-3 shadow-sm"
                >
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    autoFocus
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white font-semibold"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={
                        createListMutation.isPending || !newListTitle.trim()
                      }
                      className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
                    >
                      {createListMutation.isPending
                        ? "Adding..."
                        : "Add list"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListTitle("");
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingList(true)}
                  className="w-full flex items-center gap-2.5 p-3.5 rounded-2xl border border-dashed border-gray-300 bg-white/60 hover:bg-white hover:border-gray-400 text-gray-500 hover:text-gray-900 text-xs font-semibold transition group shadow-xs"
                >
                  <div className="h-7 w-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition">
                    <Plus size={15} />
                  </div>
                  <span>Add another list</span>
                </button>
              )}
            </div>
          </div>

          {/* Drag Overlay Preview */}
          <DragOverlay>
            {activeTask && (
              <div className="w-72 rounded-xl border border-gray-300 bg-white p-3.5 shadow-xl rotate-1 text-gray-900">
                {activeTask.coverColor && (
                  <div
                    className="h-3.5 w-full rounded-md mb-2"
                    style={{ backgroundColor: activeTask.coverColor }}
                  />
                )}
                <h4 className="text-xs font-semibold text-gray-900">
                  {activeTask.title}
                </h4>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Drawer / Modal */}
      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          projectId={projectId}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default TaskBoard;