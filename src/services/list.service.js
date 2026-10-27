import { api } from "./api";

export const getProjectLists = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/lists`);
  return response.data.data;
};

export const createList = async ({ projectId, ...data }) => {
  const response = await api.post(`/projects/${projectId}/lists`, data);
  return response.data.data;
};

export const updateList = async ({ projectId, listId, ...data }) => {
  const response = await api.patch(
    `/projects/${projectId}/lists/${listId}`,
    data
  );
  return response.data.data;
};

export const deleteList = async ({ projectId, listId }) => {
  const response = await api.delete(
    `/projects/${projectId}/lists/${listId}`
  );
  return response.data;
};

export const reorderLists = async ({ projectId, lists }) => {
  const response = await api.patch(
    `/projects/${projectId}/lists/reorder`,
    { lists }
  );
  return response.data;
};
