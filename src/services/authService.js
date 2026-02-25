import { apiClient, setAccessToken } from "../lib/apiClient";

export const authService = {
  async login(payload) {
    const res = await apiClient.post("/user/authenticate", payload);
    setAccessToken(res);
    return res;
  },

  async register(payload) {
    const res = await apiClient.post("/User/register", payload);
    setAccessToken(res);
    return res;
  },

  async refresh() {
    const res = await apiClient.post("/refresh-token");
    setAccessToken(res.data); 
    return res.data;
  },
};
