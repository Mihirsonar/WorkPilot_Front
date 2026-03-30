import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "../../services/project.services.js";
import {createProject} from "../../services/createProject.service.js"
import ProjectCard from "../../components/project/ProjectCard";
import CreateProjectModel from "../../components/project/CreateProjectModel";
import React, { useState } from "react";
import toast from "react-hot-toast";

function Projects() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  const queryClient = useQueryClient();


  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects
  });


  const { mutate, isPending } = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      toast.success("Project created 🚀");

      queryClient.invalidateQueries(["projects"]);

      setIsCreateProjectModalOpen(false);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  });


  const handleCreateProject = (data) => {
    mutate(data);
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold">
          Projects
        </h1>

        <button 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => setIsCreateProjectModalOpen(true)}
        >
          + Create Project
        </button>

        {isCreateProjectModalOpen && (
          <CreateProjectModel
            onClose={() => setIsCreateProjectModalOpen(false)}
            onCreate={handleCreateProject}
            isLoading={isPending} 
          />
        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}

      </div>

    </div>
  );
}

export default Projects;