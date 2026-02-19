import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; // Import your Zustand store

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

api.interceptors.request.use(
    (config) => {
        // 1. Get the latest state from Zustand
        const { accessToken, activeCompanyId } = useAuthStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (activeCompanyId) {
            config.headers['company_id'] = activeCompanyId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        if (response.data?.status === false) {
            return Promise.reject({
                response: {
                    data: response.data
                }
            });
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;