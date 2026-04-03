import { api } from "./api";
export const getProjectTasks = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data.data;
    // console.log("Fetched tasks:", response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const createTask = async (projectId, taskData) => {
  try {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
    // console.log(response.data)
  } catch (error) {
    throw new Error(error, "Failed to create task");
  }
};

export const updateTask = async ({ projectId, taskId, ...data }) => {
  const response = await api.patch(
    `/projects/${projectId}/tasks/${taskId}`,
    data
  );
  return response.data;
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};