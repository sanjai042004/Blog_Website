import axios from "axios";

export const api = axios.create({
  baseURL: "https://blog-website-1-o9mj.onrender.com/api",
  withCredentials: true,
});

// ✅ Token Refresh Queue Handling
let isRefreshing = false;
let requestQueue = [];

const processQueue = (error, token = null) => {
  requestQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  requestQueue = [];
};

// ✅ Attach Access Token to Every Request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Handle 401 (Unauthorized) & Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if no response or already retried or is refresh request
    if (
      !error.response ||
      originalRequest._retry ||
      error.response.status !== 401 ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue requests while refresh is happening
      return new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh");
      const newToken = data.accessToken;

      if (newToken) {
        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      }

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err);
      localStorage.removeItem("accessToken");

      // Optional: redirect to login if refresh fails
      if ([401, 403].includes(err.response?.status)) {
        window.location.href = "/login";
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
