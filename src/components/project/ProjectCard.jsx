import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const colors = ["bg-indigo-500", "bg-pink-500", "bg-green-500"];

const getColor = (id) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getInitials = (name) =>
  name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="relative bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
    >

      {/* MENU BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ⋮
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-10 right-3 bg-white shadow-lg rounded-md w-36 z-10 border"
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit(project._id);
              console.log("Edit project with ID:", project._id);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete(project._id);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
          >
            🗑 Delete
          </button>
        </div>
      )}

      {/* CONTENT */}
      <h3 className='text-lg font-semibold'>{project.name}</h3>

      <p className='text-gray-500 text-sm mt-2'>
        {project.description || "No description available"}
      </p>

      <div className='flex justify-between items-center mt-4 text-sm'>
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((member) => (
            <div
              key={member._id}
              title={member.username}
              className={`w-8 h-8 ${getColor(member._id)} text-white rounded-full flex items-center justify-center text-xs border-2 border-white`}
            >
              {getInitials(member.username)}
            </div>
          ))}

          {project.totalMembers > 4 && (
            <div className="w-8 h-8 bg-gray-300 text-black rounded-full flex items-center justify-center text-xs border-2 border-white">
              +{project.totalMembers - 4}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}