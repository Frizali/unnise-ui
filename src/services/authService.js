import { apiClient } from "../lib/apiClient";

export const authService = {
    login(payload){
        return apiClient.post('/user/authenticate', payload)
    },

    register(payload){
        return apiClient.post('/User/register', payload)
    }
}