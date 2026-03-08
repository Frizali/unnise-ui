import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5157/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getTokenExpiration = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const exp = getTokenExpiration(token);
  if (!exp) return true;

  return Date.now() >= exp;
};

const getCookie = (name) => {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? match[2] : null;
};

const refreshAccessToken = async () => {
  const refreshToken = getCookie("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const res = await axios.post(
    "http://localhost:5157/api/user/refresh-token",
    {
      refreshToken: refreshToken,
    },
    { withCredentials: true }
  );

  const newToken = res.data;

  localStorage.setItem("accessToken", newToken);

  return newToken;
};

apiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");

    if (token) {
      if (isTokenExpired(token)) {
        try {
          token = await refreshAccessToken();
        } catch (error) {
          localStorage.removeItem("accessToken");
          return Promise.reject(error);
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({ message: "Network error" });
  }
);

export default apiClient;