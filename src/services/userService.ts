import api from './api'; // Your axios instance
import type { User } from '../types';

export const userService = {
    getUsers: async (status: any = "all"): Promise<User[]> => {
        // Build params object

        const response = await api.get('/user', {
            params: {
                status: status
            }
        });

        return response.data.data.map((u: any) => ({
            id: u.id,
            name: u.first_name,
            email: u.email,
            initials: u.initials || u.first_name?.charAt(0) || '?',
            phoneNumber: u.phone,
            role: u.role?.title || 'No Role',
            role_id: u.role?.id || 'No Role',
            status: u.status,
            title: u.title || '--'
        }));
    },

    getUserById: async (id: string): Promise<User> => {
        const response = await api.get(`/user/${id}`);
        return response.data.data;
    },

    createUser: async (userData: any): Promise<User> => {
        const response = await api.post('/user', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    updateUserStatus: async (id: string, status: boolean): Promise<void> => {
        await api.post(`/user/${id}/status`, { status });
    },

    updateUser: async (userData: any, id: string): Promise<User> => {
        const response = await api.post(`/user/${id}`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/user/${id}`);
    },



    getResponsibilities: async (): Promise<{ id: string; title: string }[]> => {
        const response = await api.get('/user/dropdown-responsibility');
        return response.data;
    },


    getRoles: async (): Promise<{ label: string; id: string }[]> => {
        const response = await api.post('/role/dropdown');
        if (response.data && response.data.status && response.data.data) {
            return Object.entries(response.data.data).map(([label, id]) => ({
                label,
                id: id as string
            }));
        }

        return [];
    },

    deleteUserImage: async (id: string): Promise<void> => {
        await api.delete(`/user/${id}/image`);
    },



};