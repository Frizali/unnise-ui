import { apiClient } from "../lib/apiClient";

export const columnService = {
    async create(payload){
        return await apiClient.post('/projects', payload);
    },
    
    async getByProject(projectId){
        return await apiClient.get(`/projects/${projectId}/columns`)
    }
}