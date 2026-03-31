import { apiClient } from "../lib/apiClient"

export const cardService = {
    async getByProject(projectId) {
        return await apiClient.get(`/projects/${projectId}/cards`)
    },

    async update(projectId, cardId, payload) {
        return await apiClient.put(`/projects/${projectId}/cards/${cardId}`, payload)
    },

    async move(projectId, cardId, payload) {
        return await apiClient.put(`/projects/${projectId}/cards/${cardId}/move`, payload)
    },

    async setCardAssignees(projectId, cardId, payload) {
        return await apiClient.put(`/projects/${projectId}/cards/${cardId}/assignees`, payload)
    },

    async setCardLabels(projectId, cardId, payload) {
        return await apiClient.put(`/projects/${projectId}/cards/${cardId}/labels`, payload)
    }
}