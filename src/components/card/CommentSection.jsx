import React, { useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTaskComments,
  createComment,
  deleteComment,
} from "../../services/comment.service.js";
import toast from "react-hot-toast";

function CommentSection({ projectId, taskId }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", projectId, taskId],
    queryFn: () => getTaskComments({ projectId, taskId }),
    enabled: !!taskId,
  });

  const addMutation = useMutation({
    mutationFn: (text) => createComment({ projectId, taskId, content: text }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", projectId, taskId],
      });
      setContent("");
      toast.success("Comment added");
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) =>
      deleteComment({ projectId, taskId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", projectId, taskId],
      });
      toast.success("Comment deleted");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addMutation.mutate(content.trim());
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
        <MessageSquare size={15} className="text-gray-500" />
        <span>Activity & Discussion</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          {comments.length}
        </span>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 focus:border-gray-900 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none resize-none transition"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addMutation.isPending || !content.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition"
          >
            <Send size={12} />
            <span>{addMutation.isPending ? "Posting..." : "Comment"}</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-2.5 pt-1">
        {isLoading ? (
          <div className="text-center py-3 text-xs text-gray-400">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-2">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((c) => {
            const author = c.createdBy?.username || "User";
            const initial = author.charAt(0).toUpperCase();

            return (
              <div
                key={c._id}
                className="group flex items-start gap-2.5 p-3 rounded-xl bg-gray-50/70 border border-gray-200/80 transition"
              >
                <div className="h-7 w-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-900">
                      {author}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap break-words leading-relaxed">
                    {c.content}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(c._id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-600 p-1 rounded-md transition shrink-0"
                  title="Delete comment"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CommentSection;
