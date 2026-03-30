import { apiClient } from "../lib/apiClient";

export const projectService = {
    async create(payload){
        return await apiClient.post('/projects', payload);
    },

    async checkName(payload){
        return await apiClient.post('/projects/check-name', payload);
    },

    async projects(){
        return await apiClient.get('/projects');
    },

    async getById(id){
        return await apiClient.get(`/projects/${id}`)
    },
    
    async getMembers(id){
        return await apiClient.get(`/projects/${id}/members`)
    },

    async getLabels(id){
        return await apiClient.get(`/projects/${id}/labels`)
    }
}