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

const getUsers = async ()=>{
     try {  
            const res = await api.get(`/users`);
            // console.log(res.data)
          return res.data.users;
        } catch (error) {
         console.error(`Error While fetching USers`,error);
        }

}

export { getProjects, getProjectById ,getProjectMembers,getUsers};