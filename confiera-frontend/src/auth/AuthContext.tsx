import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

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
            // Try to refresh token immediately to check session
            // Note: For a real app, you might want a specific /me endpoint, 
            // but /auth/refresh returns a new access token if valid.
            const res = await api.post('/auth/refresh');
            if (res.data.accessToken) {
                setAccessToken(res.data.accessToken);
                // Ideally decode token to get user info or call /me
                // For MVP we might not have user info unless we decode or store it.
                // Let's rely on login setting it for now, or decode the JWT here.
                const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
                setUser({
                    id: payload.sub,
                    email: payload.email,
                    roles: payload.roles,
                    firstName: '', lastName: '' // missing in token payload usually
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
        // Setup interceptor for 401s if not already set? 
        // Simplified for this snippet.
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

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
