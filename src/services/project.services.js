import {api} from "./api.js";

 const getProjects = async () => {
    try {
        const response = await api.get("/projects");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

 const getProjectById = async (projectId) => {
    try {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
        throw error;
    }
};

    const getProjectMembers = async (projectId)=>{
        try {  
            const res = await api.get(`/projects/${projectId}/members`);
            return res.data.data;
        } catch (error) {
         console.error(`Error While fetching Members`,error);
        }

    }

const getUsers = async () => {
  try {  
    const res = await api.get(`/users`);
    return res.data.users || [];
  } catch (error) {
    console.error(`Error While fetching Users`, error);
    return []; // ✅ VERY IMPORTANT
  }
};

const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw error;
  }
};

const updateProject = async (projectId, data) => {
  try {
    const response = await api.put(`/projects/${projectId}`, data); 
    return response.data;
  }
    catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    throw error;
  }
};

export { getProjects, getProjectById ,getProjectMembers,getUsers,deleteProject,updateProject};