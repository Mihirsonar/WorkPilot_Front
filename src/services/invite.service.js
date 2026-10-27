import { api } from "./api";

export const acceptInvite = async (projectId, inviteToken) => {
  const response = await api.post(
    `/projects/${projectId}/invite/${inviteToken}/accept`
  );
  return response.data;
};
