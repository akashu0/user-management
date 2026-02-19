// src/services/authService.ts

import api from "./api";

export interface LoginResponse {
    token: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
    message?: string;
}

export const loginService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await api.post<LoginResponse>('/login', {
                email,
                password,
            });
            return response.data;
        } catch (error: any) {
            // Extract the specific error message from the API response
            const message = error.response?.data?.message || 'Invalid email or password';
            throw new Error(message);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};