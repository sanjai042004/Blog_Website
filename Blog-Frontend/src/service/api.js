import axios from "axios";

export const api = axios.create({
  baseURL: "https://blog-website-zwu2.onrender.com/api",
  withCredentials: true,
});

// Before sending any request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) config.headers.Authorization = `Bearer ${token}`; 
  return config;
});

// To handle token refresh automatically
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((req) => {
    if (error) req.reject(error);
    else req.resolve(token);
  });
  failedQueue = [];
};

// Handle API responses & errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // prevent infinite loops
    if (original._retry) return Promise.reject(error);
    original._retry = true;

    // if already refreshing - wait
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    // start refreshing
    isRefreshing = true;
    try {
      const { data } = await api.post("/auth/refresh");
      const newToken = data.accessToken;

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      }

      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (err) {
      processQueue(err, null);
      localStorage.removeItem("accessToken");
      window.location.href = "/"; 
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
