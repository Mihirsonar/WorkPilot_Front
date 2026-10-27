import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptInvite } from "../../services/invite.service";
import toast from "react-hot-toast";
import {
  X,
  Link2,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function JoinProjectModal({ onClose }) {
  const [inviteInput, setInviteInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Helper to extract projectId & token whether full URL or partial path or token is given
  const parseInviteInput = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    // Matches /invite/:projectId/:inviteToken anywhere in the string (full URL or path)
    const match = trimmed.match(/invite\/([a-fA-F0-9]{24})\/([a-fA-F0-9]{64})/);
    if (match) {
      return { projectId: match[1], inviteToken: match[2] };
    }

    // Also support "projectId/inviteToken" directly separated by slash or space
    const parts = trimmed.split(/[\/\s]+/);
    if (parts.length === 2 && parts[0].length === 24 && parts[1].length === 64) {
      return { projectId: parts[0], inviteToken: parts[1] };
    }

    return null;
  };

  const joinMutation = useMutation({
    mutationFn: ({ projectId, inviteToken }) => acceptInvite(projectId, inviteToken),
    onSuccess: (data, variables) => {
      toast.success("Successfully joined project! 🎉");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
      navigate(`/projects/${variables.projectId}`);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        "Invalid or expired invitation link. Please check and try again.";
      setErrorMsg(msg);
      toast.error(msg);
    },
  });

  const handleJoin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const parsed = parseInviteInput(inviteInput);
    if (!parsed) {
      setErrorMsg(
        "Please enter a valid invite link (e.g. http://localhost:5173/invite/projectId/token)"
      );
      return;
    }

    joinMutation.mutate(parsed);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-xs">
                <Link2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Join a Project
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Paste the invite link shared by your project admin
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleJoin} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Invitation Link or URL *
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2.5 focus-within:border-gray-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 transition">
                <Link2 size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="http://localhost:5173/invite/674.../8a3f..."
                  value={inviteInput}
                  onChange={(e) => {
                    setInviteInput(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400 font-mono"
                  autoFocus
                  required
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-500 mt-1.5 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-3.5 flex items-start gap-2.5">
              <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                When you join with a valid link, this project will appear in your Workspaces and you can start collaborating immediately.
              </p>
            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={joinMutation.isPending || !inviteInput.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {joinMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>Join Workspace</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
