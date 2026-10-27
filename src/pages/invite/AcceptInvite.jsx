import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { acceptInvite } from "../../services/invite.service";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function AcceptInvite() {
  const { projectId, inviteToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.LOADING);
  const [message, setMessage] = useState("");
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    let cancelled = false;

    const accept = async () => {
      try {
        const data = await acceptInvite(projectId, inviteToken);
        if (cancelled) return;
        setStatus(STATUS.SUCCESS);
        setMessage(data?.message || "You've been added to the project!");
        setProjectName(data?.data?.project?.name || "");
      } catch (err) {
        if (cancelled) return;
        const msg =
          err?.response?.data?.message ||
          "Unable to accept the invitation. The link may be invalid or expired.";
        setStatus(STATUS.ERROR);
        setMessage(msg);
      }
    };

    accept();
    return () => {
      cancelled = true;
    };
  }, [projectId, inviteToken]);

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4 sm:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        {/* Header Strip */}
        <div className="px-8 pt-8 pb-4 flex items-center gap-3 border-b border-gray-100">
          <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-sm">
            <FolderKanban size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
              WorkPilot
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Project Invitation
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10 flex flex-col items-center text-center">
          {/* Loading State */}
          {status === STATUS.LOADING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Loader2
                  size={28}
                  className="animate-spin text-gray-400"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  Accepting Invitation
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
                  Please wait while we process your invite…
                </p>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {status === STATUS.SUCCESS && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  You're In!
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
                  {message}
                </p>
                {projectName && (
                  <p className="text-xs font-semibold text-gray-700 mt-2">
                    Project: {projectName}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/projects/${projectId}`)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm hover:shadow transition mt-2 cursor-pointer"
              >
                <span>Go to Project</span>
                <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          )}

          {/* Error State */}
          {status === STATUS.ERROR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <XCircle size={28} className="text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  Invitation Failed
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-xs">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition cursor-pointer"
                >
                  Go Home
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm hover:shadow transition cursor-pointer"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400">
            Invitation links are single-use and may expire.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
