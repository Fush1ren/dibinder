import axios from "axios";
import { useAuthStore } from "@/stores";
import config from "@/config";
import router from "@/router";

export const api = axios.create({
    baseURL: `${config.api_url}/api`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }, (e) => {
        return Promise.reject(e);
    }
)

api.interceptors.response.use((response) => response, (e) => {
     if (e.response && e.response.status === 401) {
    const authStore = useAuthStore()

    console.error("Unauthorized or token expired. Logging out.")

    authStore.clearUser();

    router.push('/login');
  }

  return Promise.reject(e);
});