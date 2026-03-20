import { create } from 'zustand';
import { api } from '@/lib/axios';

interface Profile {
    id: string;
    email: string | null;
    fullName: string | null;
    role: 'ADMINISTRATOR' | 'CASHIER' | 'WAITER' | 'KITCHEN' | 'CUSTOMER';
    points: number;
}

interface AuthState {
    user: any | null;
    profile: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,

    login: (token, userData) => {
        localStorage.setItem('access_token', token);
        const profile: Profile = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName || userData.full_name,
            role: userData.role,
            points: userData.points || 0,
        };
        set({ user: userData, profile, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    },

    checkSession: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const { data } = await api.get('/auth/me');
            const profile: Profile = {
                id: data.id,
                email: data.email,
                fullName: data.fullName || data.full_name,
                role: data.role,
                points: data.points || 0,
            };
            set({ user: data, profile, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('access_token');
            set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
        }
    }
}));
