import apiClient from "../lib/apiClient";

export const invitationService = {
  async create(payload) {
    return await apiClient.post("/invitations", payload);
  },

  async getByToken(token) {
    return await apiClient.get(`/invitations/${token}`);
  },

  async getMemberSuggestions(payload){
    return await apiClient.post(`/invitations/member-suggestions`, payload)
  },

  async acceptInvitation(payload){
    return await apiClient.post('/invitations/accept', payload)
  }
};
