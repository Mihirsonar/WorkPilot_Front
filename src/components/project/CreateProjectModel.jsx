import {
  useState,
} from "react";

import React from "react";

import { motion } from "framer-motion";

import {
  useQuery,
} from "@tanstack/react-query";

import { getUsers } from "../../services/project.services.js";

import {
  X,
  Search,
  Users,
  FolderKanban,
  FileText,
  Sparkles,
  Plus,
  Check,
} from "lucide-react";

function CreateProjectModel({
  onClose,
  onCreate,
}) {
  // FORM STATE
  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [search, setSearch] =
    useState("");

  const [
    selectedUsers,
    setSelectedUsers,
  ] = useState([]);

  // USERS
  const {
    data = [],
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = data || [];

  // FILTER USERS
  const filteredUsers =
    users.filter((user) => {
      if (!search.trim())
        return true;

      return user.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );
    });

  // TOGGLE USER
  const toggleUser = (
    user
  ) => {
    const exists =
      selectedUsers.find(
        (u) =>
          u._id === user._id
      );

    if (exists) {
      setSelectedUsers(
        selectedUsers.filter(
          (u) =>
            u._id !== user._id
        )
      );
    } else {
      setSelectedUsers([
        ...selectedUsers,
        user,
      ]);
    }
  };

  // SUBMIT
  const handleSubmit = () => {
    onCreate({
      name,
      description,
      members:
        selectedUsers.map(
          (u) => u._id
        ),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      {/* MODAL */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40"
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 h-52 w-52 bg-indigo-500/20 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="relative z-10 flex items-start justify-between border-b border-white/10 p-6">
          {/* LEFT */}
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <FolderKanban
                size={28}
                className="text-indigo-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  size={16}
                  className="text-indigo-300"
                />

                <span className="text-sm text-indigo-300 font-medium">
                  Workspace Setup
                </span>
              </div>

              <h2 className="text-3xl font-bold text-white">
                Create Project
              </h2>

              <p className="text-slate-400 mt-2">
                Build a new project
                workspace and invite
                your team members.
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="relative z-10 p-6 space-y-6">
          {/* PROJECT NAME */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <FolderKanban
                size={16}
                className="text-indigo-400"
              />

              Project Name
            </label>

            <input
              placeholder="WorkPilot Dashboard..."
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/40 transition-all duration-300"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <FileText
                size={16}
                className="text-cyan-400"
              />

              Description
            </label>

            <textarea
              placeholder="Describe your project goals and workflow..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-slate-500 outline-none resize-none focus:border-indigo-500/40 transition-all duration-300"
            />
          </div>

          {/* SEARCH USERS */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Users
                size={16}
                className="text-emerald-400"
              />

              Invite Members
            </label>

            {/* SEARCH */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 mb-4">
              <Search
                size={18}
                className="text-slate-500"
              />

              <input
                placeholder="Search team members..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
              />
            </div>

            {/* USER LIST */}
            <div className="max-h-72 overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  Loading users...
                </div>
              ) : filteredUsers.length >
                0 ? (
                filteredUsers.map(
                  (user) => {
                    const isSelected =
                      selectedUsers.find(
                        (
                          u
                        ) =>
                          u._id ===
                          user._id
                      );

                    return (
                      <div
                        key={
                          user._id
                        }
                        onClick={() =>
                          toggleUser(
                            user
                          )
                        }
                        className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "bg-indigo-500/10 border border-indigo-500/20"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {/* LEFT */}
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-semibold shadow-lg shadow-indigo-500/20">
                            {user.username
                              ?.charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          {/* Info */}
                          <div>
                            <h4 className="text-white font-medium">
                              {
                                user.username
                              }
                            </h4>

                            <p className="text-sm text-slate-500">
                              {user.email ||
                                "Team Member"}
                            </p>
                          </div>
                        </div>

                        {/* CHECK */}
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-indigo-500 text-white"
                              : "bg-white/5 text-slate-500 group-hover:bg-white/10"
                          }`}
                        >
                          {isSelected ? (
                            <Check
                              size={
                                16
                              }
                            />
                          ) : (
                            <Plus
                              size={
                                16
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users
                    size={36}
                    className="text-slate-600 mb-4"
                  />

                  <p className="text-slate-400">
                    No users found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SELECTED USERS */}
          {selectedUsers.length >
            0 && (
            <div>
              <p className="text-sm font-medium text-slate-300 mb-4">
                Selected Members
              </p>

              <div className="flex flex-wrap gap-3">
                {selectedUsers.map(
                  (user) => (
                    <div
                      key={
                        user._id
                      }
                      className="flex items-center gap-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                        {user.username
                          ?.charAt(
                            0
                          )
                          .toUpperCase()}
                      </div>

                      <span className="text-sm text-indigo-200">
                        {
                          user.username
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
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
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Plus size={18} />

            Create Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateProjectModel;