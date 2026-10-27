import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../services/task.services.js";
import { updateList, deleteList } from "../../services/list.service.js";
import toast from "react-hot-toast";

function TaskColumn({
  list,
  tasks = [],
  activeTask,
  onTaskClick,
  projectId,
}) {
  const listId = String(list._id);
  const { setNodeRef, isOver } = useDroppable({
    id: listId,
  });

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);

  const queryClient = useQueryClient();

  // Create Card mutation
  const createCardMutation = useMutation({
    mutationFn: (title) =>
      createTask({
        projectId,
        title,
        list: list._id,
        status: list.title.toLowerCase().includes("done")
          ? "done"
          : list.title.toLowerCase().includes("progress")
          ? "in_progress"
          : "todo",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      setNewCardTitle("");
      setIsAddingCard(false);
      toast.success("Card created");
    },
    onError: () => toast.error("Failed to create card"),
  });

  // Rename List mutation
  const updateListMutation = useMutation({
    mutationFn: (newTitle) =>
      updateList({ projectId, listId: list._id, title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", projectId] });
      setIsEditingTitle(false);
      toast.success("List renamed");
    },
  });

  // Delete List mutation
  const deleteListMutation = useMutation({
    mutationFn: () => deleteList({ projectId, listId: list._id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("List deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete list");
    },
  });

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    createCardMutation.mutate(newCardTitle.trim());
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (!titleValue.trim()) return;
    updateListMutation.mutate(titleValue.trim());
  };

  const taskIds = tasks.map((t) => String(t._id));

  return (
    <div
      ref={setNodeRef}
      className={`w-72 md:w-80 shrink-0 flex flex-col max-h-[calc(100vh-210px)] rounded-2xl border transition-all duration-200 select-none ${
        isOver
          ? "border-gray-400 bg-gray-200/60 shadow-lg scale-[1.01]"
          : "border-gray-200/80 bg-[#f1f3f5]"
      }`}
    >
      {/* List Header */}
      <div className="p-3.5 border-b border-gray-200/60 relative">
        <div className="flex items-center justify-between gap-2">
          {/* Accent dot */}
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: list.color || "#0f172a" }}
          />

          {/* Title or edit title */}
          {isEditingTitle ? (
            <form
              onSubmit={handleTitleSubmit}
              className="flex items-center gap-1.5 flex-1"
            >
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                autoFocus
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-900 outline-none font-semibold focus:border-gray-900"
              />
              <button
                type="submit"
                className="p-1 rounded bg-gray-900 text-white hover:bg-black"
              >
                <Check size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitleValue(list.title);
                  setIsEditingTitle(false);
                }}
                className="p-1 rounded text-gray-400 hover:text-gray-700"
              >
                <X size={13} />
              </button>
            </form>
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-bold text-gray-900 tracking-wide truncate flex-1 cursor-pointer hover:text-gray-600 transition-colors"
              title="Click to rename list"
            >
              {list.title}
            </h3>
          )}

          {/* Count Badge */}
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white text-gray-600 border border-gray-200/80 shadow-xs">
            {tasks.length}
          </span>

          {/* Options Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="h-6 w-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-all"
            >
              <MoreHorizontal size={15} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-7 z-50 w-40 rounded-xl border border-gray-200 bg-white shadow-xl p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditingTitle(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all text-left"
                  >
                    <Edit2 size={13} className="text-gray-500" />
                    Rename List
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (
                        window.confirm(
                          `Delete "${list.title}"? Any cards will be moved or deleted.`
                        )
                      ) {
                        deleteListMutation.mutate();
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all text-left"
                  >
                    <Trash2 size={13} />
                    Delete List
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Cards Container (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-[100px]">
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isDragging={activeTask?._id === task._id}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isAddingCard && (
          <div className="h-24 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl text-gray-400 text-xs">
            <span>No cards in this list</span>
            <span className="text-[11px] text-gray-400 mt-0.5">
              Drag cards here
            </span>
          </div>
        )}
      </div>

      {/* List Footer: Add a Card */}
      <div className="p-2.5 border-t border-gray-200/60">
        {isAddingCard ? (
          <form onSubmit={handleCreateCard} className="space-y-2">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title..."
              rows={2}
              autoFocus
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 placeholder:text-gray-400 outline-none resize-none focus:border-gray-900 shadow-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateCard(e);
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={
                  createCardMutation.isPending || !newCardTitle.trim()
                }
                className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
              >
                {createCardMutation.isPending ? "Adding..." : "Add card"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-all"
              >
                <X size={15} />
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className="w-full flex items-center gap-2 py-1.5 px-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 transition-all group"
          >
            <Plus
              size={14}
              className="group-hover:text-gray-900 transition-colors"
            />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskColumn;