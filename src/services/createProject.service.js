import { api } from "./api";
export const createProject = async (projectData) => {
    try {
        const response = await api.post("/projects", projectData);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};