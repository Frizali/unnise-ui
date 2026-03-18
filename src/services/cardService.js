import { apiClient } from "../lib/apiClient"

export const cardService = {
    async getByProject(projectId){
        return await apiClient.get(`/projects/${projectId}/cards`)
    },

    async move(projectId, cardId, payload){
        return await apiClient.put(`/projects/${projectId}/cards/${cardId}/move`, payload)
    }
}