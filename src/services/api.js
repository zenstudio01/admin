import axios from "axios";
import storage from "../utils/storage";

const API_URL =
  import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      storage.getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

let isRefreshing = false;
let refreshQueue = [];

function processQueue(
  error,
  accessToken = null
) {
  refreshQueue.forEach(
    ({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(accessToken);
      }
    }
  );

  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    const isRefreshEndpoint =
      originalRequest?.url?.includes(
        "/refresh_token/"
      );

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isRefreshEndpoint
    ) {
      return Promise.reject(error);
    }

    const refreshToken =
      storage.getRefreshToken();

    if (!refreshToken) {
      storage.clearAuth();

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          refreshQueue.push({
            resolve,
            reject,
          });
        }
      ).then((newAccessToken) => {
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response =
        await axios.post(
          `${API_URL}/refresh_token/`,
          {
            refresh_token:
              refreshToken,
          }
        );

      const newAccessToken =
        response.data.access_token;

      if (!newAccessToken) {
        throw new Error(
          "The backend did not return an access token."
        );
      }

      storage.setAccessToken(
        newAccessToken
      );

      api.defaults.headers.common.Authorization =
        `Bearer ${newAccessToken}`;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      processQueue(
        null,
        newAccessToken
      );

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(
        refreshError,
        null
      );

      storage.clearAuth();

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;