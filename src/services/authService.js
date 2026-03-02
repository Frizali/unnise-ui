import { apiClient, setAccessToken } from "../lib/apiClient";

export const authService = {
  async login(payload) {
    const res = await apiClient.post("/user/authenticate", payload);
    return res;
  },

  async register(payload) {
    const res = await apiClient.post("/User/register", payload);
    return res;
  },

  async refresh() {
    const res = await apiClient.post("/refresh-token");
    return res.data;
  },
};
