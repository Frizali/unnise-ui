import { apiClient } from "../lib/apiClient"

export const cardService = {
    async getByProject(projectId){
        return await apiClient.get(`/projects/${projectId}/cards`)
    }
}