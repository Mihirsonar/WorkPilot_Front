import React from 'react'
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

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
    >
      <h3 className='text-lg font-semibold'>{project.name}</h3>

      <p className='text-gray-500 text-sm mt-2'>
        {project.description || "No description available"}
      </p>

      <div className='flex justify-between items-center mt-4 text-sm'>
        {/* <span>{project.totalMembers}</span> */}

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