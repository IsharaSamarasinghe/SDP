import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (data: any) => Promise<User>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: any) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Important for cookies
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from access token (if stored in memory/persisted state, or check refresh)
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.post('/auth/refresh');
            if (res.data.accessToken) {
                setAccessToken(res.data.accessToken);
                const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
                setUser({
                    id: payload.sub,
                    email: payload.email,
                    roles: payload.roles,
                    firstName: '', lastName: ''
                });
            }
        } catch (e) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const setAccessToken = (token: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const login = async (credentials: any) => {
        const res = await api.post('/auth/login', credentials);
        const { accessToken, user } = res.data;
        setAccessToken(accessToken);
        setUser(user);
        return user;
    };

    const signup = async (data: any) => {
        await api.post('/auth/signup', data);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) { console.error(e); }
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    const forgotPassword = async (email: string) => {
        await api.post('/auth/forgot-password', { email });
    };

    const resetPassword = async (data: any) => {
        await api.post('/auth/reset-password', data);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            signup,
            logout,
            forgotPassword,
            resetPassword,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
