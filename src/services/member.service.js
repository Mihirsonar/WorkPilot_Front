import { api } from "./api";

export const addMemberToProject = async (projectId, { email, role }) => {
  const response = await api.post(`/projects/${projectId}/members`, {
    email,
    role,
  });
  return response.data;
};

export const generateInviteLink = async (projectId, role = "member") => {
  const response = await api.post(`/projects/${projectId}/invite`, {
    role,
  });
  return response.data;
};


export const removeMemberFromProject = async (projectId, userId) => {
  const response = await api.delete(`/projects/${projectId}/members/${userId}`);
  return response.data;
};

export const updateMemberRole = async (projectId, userId, role) => {
  const response = await api.put(`/projects/${projectId}/members/${userId}`, {
    role,
  });
  return response.data;
};
