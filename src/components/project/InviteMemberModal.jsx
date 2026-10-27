import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateInviteLink, removeMemberFromProject } from "../../services/member.service.js";
import { getProjectMembers } from "../../services/project.services.js";
import toast from "react-hot-toast";
import {
  X,
  Users,
  Loader2,
  Shield,
  ShieldCheck,
  Crown,
  Trash2,
  Search,
  Copy,
  Check,
  Link2,
} from "lucide-react";

const ROLE_OPTIONS = [
  { value: "member", label: "Member", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "project_admin", label: "Project Admin", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
  { value: "admin", label: "Admin", icon: Crown, color: "text-rose-600", bg: "bg-rose-50" },
];

// Robust clipboard copying with fallback for any browser/context
export const copyTextToClipboard = async (text) => {
  if (!text) return false;

  // 1. Try modern navigator.clipboard
  if (navigator?.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn("navigator.clipboard failed, attempting fallback:", e);
    }
  }

  // 2. Fallback using document.execCommand('copy')
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
    return false;
  }
};

function InviteMemberModal({ projectId, projectName, onClose }) {
  const [role, setRole] = useState("member");
  const [activeTab, setActiveTab] = useState("invite"); // "invite" | "members"
  const [memberSearch, setMemberSearch] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  // Fetch current members
  const { data: members = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });

  // Generate invite link mutation
  const inviteMutation = useMutation({
    mutationFn: (selectedRole) => generateInviteLink(projectId, selectedRole),
    onSuccess: async (res) => {
      // Backend ApiResponse returns:
      // status, message: { inviteUrl, inviteToken } OR message: string, data: { inviteUrl }
      const payload = res?.message || res?.data || res;
      const inviteUrl =
        payload?.inviteUrl ||
        res?.data?.inviteUrl ||
        (payload?.inviteToken ? `${window.location.origin}/invite/${projectId}/${payload.inviteToken}` : "");

      if (inviteUrl) {
        setGeneratedLink(inviteUrl);
        const didCopy = await copyTextToClipboard(inviteUrl);
        if (didCopy) {
          setCopied(true);
          toast.success("Invite link generated & copied to clipboard! 📋");
          setTimeout(() => setCopied(false), 3000);
        } else {
          toast.success("Invite link generated! Click Copy to copy.");
        }
      } else {
        toast.error("Could not retrieve invite link from server response");
      }
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to generate invite link";
      toast.error(msg);
    },
  });

  // Remove member mutation
  const removeMutation = useMutation({
    mutationFn: (userId) => removeMemberFromProject(projectId, userId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: () => toast.error("Failed to remove member"),
  });

  const handleGenerate = () => {
    setCopied(false);
    inviteMutation.mutate(role);
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    const ok = await copyTextToClipboard(generatedLink);
    if (ok) {
      setCopied(true);
      toast.success("Link copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error("Please select and copy the link text manually");
    }
  };

  const filteredMembers = members.filter((m) =>
    (m.user?.username || m.user?.email || "")
      .toLowerCase()
      .includes(memberSearch.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const opt = ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];
    const Icon = opt.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${opt.bg} ${opt.color}`}>
        <Icon size={10} />
        {opt.label}
      </span>
    );
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
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Team Members
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {projectName || "Project"} · {members.length} member{members.length !== 1 ? "s" : ""}
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

          {/* TABS */}
          <div className="flex border-b border-gray-100 px-5">
            <button
              onClick={() => setActiveTab("invite")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === "invite"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Link2 size={14} />
              Invite Link
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === "members"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Users size={14} />
              Members ({members.length})
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-5">
            {activeTab === "invite" ? (
              <div className="space-y-4">
                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Member Role for Link
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = role === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                            isSelected
                              ? "border-gray-900 bg-gray-900 text-white shadow-xs"
                              : "border-gray-200 bg-gray-50/70 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                          }`}
                        >
                          <Icon size={16} className={isSelected ? "text-white" : opt.color} />
                          <span className="font-semibold">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={inviteMutation.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  {inviteMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating Link...</span>
                    </>
                  ) : (
                    <>
                      <Link2 size={14} />
                      <span>Create & Copy Invite Link</span>
                    </>
                  )}
                </button>

                {/* Generated Link Box */}
                {generatedLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Check size={14} />
                        </div>
                        <p className="text-xs font-semibold text-emerald-800">
                          Invite link ready!
                        </p>
                      </div>
                      {copied && (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          Copied!
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedLink}
                        onClick={(e) => e.target.select()}
                        className="flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[11px] text-gray-700 font-mono select-all outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          copied
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-emerald-700 leading-relaxed">
                      Share this link with user 2. They can paste it in the Dashboard's "Join with Link" option or visit it in their browser.
                    </p>
                  </motion.div>
                )}

                {!generatedLink && (
                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    Click "Create & Copy Invite Link" to generate a shareable URL. The link will be automatically copied to your clipboard.
                  </p>
                )}
              </div>
            ) : (
              /* MEMBERS TAB */
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 focus-within:border-gray-900 transition">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {isLoadingMembers ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      <Loader2 size={20} className="animate-spin mx-auto mb-2 text-gray-300" />
                      Loading members...
                    </div>
                  ) : filteredMembers.length > 0 ? (
                    filteredMembers.map((m) => (
                      <div
                        key={m._id || m.user?._id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {(m.user?.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">
                              {m.user?.username || "Unknown"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {m.user?.email || ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getRoleBadge(m.role)}
                          {m.role !== "admin" && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove ${m.user?.username} from the project?`)) {
                                  removeMutation.mutate(m.user?._id);
                                }
                              }}
                              className="h-6 w-6 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-400">
                      No members found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default InviteMemberModal;
