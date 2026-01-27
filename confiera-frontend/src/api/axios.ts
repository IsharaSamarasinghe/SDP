import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // HttpOnly cookie session
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";

    // Redirect on session expiry
    if (status === 401 && !url.includes("/auth/login")) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
