import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { getProjectById } from '../../services/project.services';
import TaskBoard from "../../components/task/TaskBoard";
import CreateTaskModel from '../tasks/CreateTaskModel';
import { useQuery } from "@tanstack/react-query";

function ProjectDetails() {
  const { projectId } = useParams();
  const [openmodel, setOpenModel] = useState(false);

const { data } = useQuery({
  queryKey: ["project", projectId],
  queryFn: () => getProjectById(projectId)
});

const project = data?.data;

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div className='flex justify-end gap-40 '>
          <h1 className="text-2xl font-semibold">
            {project?.name || "Loading..."}
          </h1>

          {/* <div className="flex items-center gap-0.5 mt-2">
            {project?.members?.map(member => (
              <div
                key={member._id}
                title={member.username}
                className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                {member.username.charAt(0).toUpperCase()}
              </div>
            ))}
          </div> */}
        </div>

        <button 
          onClick={() => setOpenModel(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Task
        </button>

      </div>

      <TaskBoard projectId={projectId} />

      {openmodel && (
        <CreateTaskModel
          projectId={projectId}
          members={project?.members || []}
          onClose={() => setOpenModel(false)}
        />
      )}

    </div>
  );
}

export default ProjectDetails;
