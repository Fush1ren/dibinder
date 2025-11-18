import type { ConfigEnv } from "@/types";

const config = {
    api_url: import.meta.env.VITE_APP_API_URL,
} as ConfigEnv;

export default config;