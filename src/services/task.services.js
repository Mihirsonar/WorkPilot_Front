import { api } from "./api";

export const getProjectTasks = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data.data;
};

export const createTask = async (arg1, arg2) => {
  let projectId;
  let taskData;
  if (typeof arg1 === "object" && arg1 !== null) {
    ({ projectId, ...taskData } = arg1);
  } else {
    projectId = arg1;
    taskData = arg2;
  }
  const response = await api.post(
    `/projects/${projectId}/tasks`,
    taskData
  );
  return response.data.data;
};

export const updateTask = async ({ projectId, taskId, taskData, ...data }) => {
  const payload = taskData ? { ...taskData, ...data } : data;
  const response = await api.patch(
    `/projects/${projectId}/tasks/${taskId}`,
    payload
  );
  return response.data.data;
};

export const deleteTask = async ({ projectId, taskId }) => {
  const response = await api.delete(
    `/projects/${projectId}/tasks/${taskId}`
  );
  return response.data;
};

export const getTaskById = async ({ projectId, taskId }) => {
  const response = await api.get(
    `/projects/${projectId}/tasks/${taskId}`
  );
  return response.data.data;
};

export const reorderTasks = async ({ projectId, tasks }) => {
  const response = await api.patch(
    `/projects/${projectId}/tasks/reorder`,
    { tasks }
  );
  return response.data;
};

export const createSubTask = async ({ projectId, taskId, title }) => {
  const response = await api.post(
    `/projects/${projectId}/tasks/${taskId}/subtasks`,
    { title }
  );
  return response.data.data;
};

export const updateSubTask = async ({ projectId, taskId, subTaskId, ...data }) => {
  const response = await api.patch(
    `/projects/${projectId}/tasks/${taskId}/subtasks/${subTaskId}`,
    data
  );
  return response.data.data;
};

export const deleteSubTask = async ({ projectId, taskId, subTaskId }) => {
  const response = await api.delete(
    `/projects/${projectId}/tasks/${taskId}/subtasks/${subTaskId}`
  );
  return response.data;
};