import { useState}from "react";
import React from "react";
import { motion } from "framer-motion";
import { getUsers } from "../../services/project.services.js";
import {useQuery} from "@tanstack/react-query"

function CreateProjectModel({ onClose,onCreate }) {

  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

const { data = [] } = useQuery({
  queryKey: ["users"],
  queryFn: getUsers
});

const users = data || [];

const filteredUsers = users.filter(user => {
  if (!search.trim()) return true;

  return user.username
    ?.toLowerCase()
    .includes(search.toLowerCase());
});
  const toggleUser = (user) => {
    const exists = selectedUsers.find(u => u._id === user._id);

    if (exists) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = () => {
    onCreate({
      name,
      description,
      members: selectedUsers.map(u => u._id)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl w-full max-w-lg"
      >

        <h2 className="text-xl font-semibold mb-4">
          Create Project
        </h2>

        {/* Name */}
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Search */}
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* User List */}
        <div className="max-h-40 overflow-y-auto border rounded mb-3">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.find(u => u._id === user._id);

            return (
              <div
                key={user._id}
                onClick={() => toggleUser(user)}
                className={`p-2 cursor-pointer flex items-center gap-2
                  ${isSelected ? "bg-indigo-100" : "hover:bg-gray-100"}`}
              >

                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                  {user.username.charAt(0)}
                </div>

                <span>{user.username}</span>
              </div>
            );
          })}
        </div>

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedUsers.map(user => (
            <div
              key={user._id}
              className="bg-indigo-100 px-3 py-1 rounded-full text-sm"
            >
              {user.username}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default CreateProjectModel;