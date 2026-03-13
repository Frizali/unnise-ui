import { apiClient } from "../lib/apiClient";

export const columnService = {
    async create(projectId, column){
        return await apiClient.post(`/projects/${projectId}/columns`, column);
    },
    
    async getByProject(projectId){
        return await apiClient.get(`/projects/${projectId}/columns`)
    },

    async reorder(projectId, columns){
        return await apiClient.put(`/projects/${projectId}/columns/reorder`, columns)
    }
}