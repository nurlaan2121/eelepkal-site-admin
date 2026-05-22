import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// All frontend requests go through the serverless proxy to bypass CORS
const PROXY_URL = '/api/proxy';

export const apiClient = axios.create({
    baseURL: PROXY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Transform /some/path into ?path=some/path
    if (config.url && config.url !== PROXY_URL) {
        const path = config.url.startsWith('/') ? config.url.substring(1) : config.url;
        config.params = { ...config.params, path };
        config.url = PROXY_URL;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);
