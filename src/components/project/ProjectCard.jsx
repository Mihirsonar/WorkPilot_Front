import React from 'react'
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";

export default function ProjectCard({ project }) {
    const navigate = useNavigate();

    return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
    >
        <h3 className='text-lg fontsemibold'>{project.name}</h3>

        <p className='text-gray-500 text-sm mt-2'>{project.description || "No description available"}</p>

        <div className='flex justify-between mt-4 text-sm'>
            <span>{project.totalMembers} </span>
            <span>{project.role} </span>
        </div>
        </motion.div>
    )
}