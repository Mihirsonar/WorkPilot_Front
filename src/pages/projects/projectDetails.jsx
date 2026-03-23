import React from 'react'
import { useState } from 'react';
import { useParams } from "react-router-dom";
import TaskBoard from "../../components/task/TaskBoard";
import CreateTaskModel from '../tasks/CreateTaskModel';

function ProjectDetails() {
  const { projectId } = useParams();
  const [openmodel, setOpenModel] = useState(false);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-semibold">
            Project Workspace
          </h1>

          <p className="text-sm text-gray-500">
            Project ID: {projectId}
          </p>
        </div>

        {/* Future: Add Task Button */}
        <button 
        onClick={()=>setOpenModel(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Add Task
        </button>

      </div>

      {/* Task Board */}
      <TaskBoard projectId={projectId} />

      {
        openmodel &&
      (
        <CreateTaskModel
        projectid={projectId}
        onClose={() => setOpenModel(false)}
        />
      )
      }

    </div>
  );
}

export default ProjectDetails;