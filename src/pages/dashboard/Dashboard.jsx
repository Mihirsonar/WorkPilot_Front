import React from 'react'
import {useQuery} from "@tanstack/react-query";
import {getProjects} from "../../services/project.services.js";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });


   return (
    <div>

      <h1 className="text-2xl font-semibold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

             <Link to="/projects" className="bg-white p-4 rounded shadow">
          Total Projects: {projects ? projects.length : 'Loading...'}
        </Link>

        <div className="bg-white p-4 rounded shadow">
          My Tasks
        </div>

        <div className="bg-white p-4 rounded shadow">
          Completed
        </div>

        <div className="bg-white p-4 rounded shadow">
          Pending
        </div>

      </div>

    </div>
  );
}