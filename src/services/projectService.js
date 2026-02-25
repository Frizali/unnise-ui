import { apiClient } from "../lib/apiClient";

export const projectService = {
    async create(payload){
        return await apiClient.post('/project/create', payload);
    },

    async checkName(payload){
        return await apiClient.post('/project/check-name', payload);
    }
}