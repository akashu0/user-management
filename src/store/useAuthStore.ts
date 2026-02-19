// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: any | null;
    accessToken: string | null;
    refreshToken: string | null;
    activeCompanyId: string | null;

    setAuth: (data: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            activeCompanyId: null,

            setAuth: (data) => set({
                user: {
                    id: data.id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    companies: data.companies
                },
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                activeCompanyId: data.companies?.[0]?.id || null
            }),

            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
                activeCompanyId: null
            }),
        }),
        { name: 'auth-storage' }
    )
);