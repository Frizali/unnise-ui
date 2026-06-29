import { apiClient } from "../lib/apiClient";

export const voteService = {
  async setVote(cardId, memberId, difficultyId) {
    return await apiClient.post(`/Cards/${cardId}/Votes`, {
      memberId,
      difficultyId,
    });
  },

  async getTally(cardId) {
    return await apiClient.get(`/Cards/${cardId}/Votes/tally`);
  },

  async getVotes(cardId) {
    return await apiClient.get(`/Cards/${cardId}/Votes`);
  },
};
