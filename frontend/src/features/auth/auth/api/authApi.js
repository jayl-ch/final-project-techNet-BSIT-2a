import axios from "axios";

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  return "";
};

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshPromise = null;

export const setAuthToken = () => {};
export const setRefreshToken = () => {};

export const getAuthToken = () => {
  return null;
};

export const getRefreshToken = () => {
  return null;
};

export const clearAuthToken = () => {
  return;
};

const storeAuthSession = () => {};

const clearAuthSession = () => {
  clearAuthToken();
};

const requestTokenRefresh = async () => {
  const response = await axios.post(
    `${resolveApiBaseUrl()}/api/student/refresh`,
    {},
    {
      timeout: 15000,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );

  return response;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      typeof originalRequest.url === "string" &&
      (originalRequest.url.includes("/api/student/login") ||
        originalRequest.url.includes("/api/student/google") ||
        originalRequest.url.includes("/api/student/register") ||
        originalRequest.url.includes("/api/student/refresh"))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = requestTokenRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    }
  },
);

export const extractAuthErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    const messageFromServer =
      error.response?.data?.message || error.response?.data?.error;

    if (error.response?.status >= 500) {
      return "Server error while processing your request. Please try again in a moment.";
    }

    if (typeof messageFromServer === "string" && messageFromServer.trim()) {
      if (messageFromServer.toLowerCase().includes("is not defined")) {
        return "Server error while processing your request. Please try again in a moment.";
      }

      return messageFromServer;
    }

    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    if (!error.response) {
      return "Unable to reach the server. Check your connection and API URL.";
    }
  }

  return "Request failed. Please verify your details and try again.";
};

export const authLogStudent = async (credentials) => {
  const payload = {
    email: credentials?.email?.trim() || "",
    password: credentials?.password || "",
  };

  const response = await apiClient.post("/api/student/login", payload);
  storeAuthSession();

  return response;
};

export const authLogStudentWithGoogle = async (idToken) => {
  const payload = {
    idToken: typeof idToken === "string" ? idToken : "",
  };

  const response = await apiClient.post("/api/student/google", payload);
  storeAuthSession();

  return response;
};

export const authLogoutStudent = async () => {
  try {
    await apiClient.post("/api/student/logout", {});
  } finally {
    clearAuthSession();
  }
};

export const authRegStudent = async (credentials) => {
  const payload = {
    name: credentials?.username?.trim() || "",
    email: credentials?.email?.trim() || "",
    password: credentials?.password || "",
  };

  return apiClient.post("/api/student/register", payload);
};

export const getAuthStudent = async () => {
  return apiClient.get("/api/student");
};

export { apiClient };
