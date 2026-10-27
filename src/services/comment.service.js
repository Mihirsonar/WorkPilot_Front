import { api } from "./api";

export const getTaskComments = async ({ projectId, taskId }) => {
  const response = await api.get(
    `/projects/${projectId}/tasks/${taskId}/comments`
  );
  return response.data.data;
};

export const createComment = async ({ projectId, taskId, content }) => {
  const response = await api.post(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    { content }
  );
  return response.data.data;
};

export const deleteComment = async ({ projectId, taskId, commentId }) => {
  const response = await api.delete(
    `/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
  return response.data;
};
