import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5157/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: "Network error" });
  }
);
