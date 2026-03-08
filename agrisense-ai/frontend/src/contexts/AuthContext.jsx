import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('agrisense_token');
            const role = localStorage.getItem('agrisense_role');
            const username = localStorage.getItem('agrisense_username');

            if (token && username) {
                console.log('[AuthContext] Found token, verifying with backend...');
                try {
                    // Quick check if token is still valid
                    await api.get('/auth/verify');
                    console.log('[AuthContext] Session verified for:', username);
                    setUser({ token, role, username });
                } catch (err) {
                    console.error('[AuthContext] Session verification failed:', err.message);
                    // Clear only if it was a real auth error (401)
                    if (err.response?.status === 401) {
                        localStorage.removeItem('agrisense_token');
                        localStorage.removeItem('agrisense_role');
                        localStorage.removeItem('agrisense_username');
                        setUser(null);
                    } else {
                        // For other errors (backend down), keep local state for now
                        setUser({ token, role, username });
                    }
                }
            } else {
                console.log('[AuthContext] No token found in localStorage');
                setUser(null);
            }
            setLoading(false);
        };
        verifySession();
    }, []);

    const login = async (username, password) => {
        console.log('[AuthContext] Login requested for:', username);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            const { data } = await api.post('/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            console.log('[AuthContext] Login success, saving to localStorage');
            localStorage.setItem('agrisense_token', data.access_token);
            localStorage.setItem('agrisense_role', data.role);
            localStorage.setItem('agrisense_username', data.username);

            const newUser = { token: data.access_token, role: data.role, username: data.username };
            setUser(newUser);
            return newUser;
        } catch (error) {
            console.error('[AuthContext] Login API failed:', error.response?.data?.detail || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('agrisense_token');
        localStorage.removeItem('agrisense_role');
        localStorage.removeItem('agrisense_username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
