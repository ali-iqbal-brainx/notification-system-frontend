import React, { createContext, useState, useContext, useEffect } from 'react';
import { logIn, signUp } from './services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('access_token') || null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
        } else {
            localStorage.removeItem('access_token');
        }
    }, [accessToken]);

    const login = async (email, password) => {
        try {
            const response = await logIn({ email, password });
            setAccessToken(response?.access_token);
            setUser(response?.user);

        } catch (error) {
            alert(error?.response?.data?.error || "Error Occured");
        }
    };


    const logout = () => {
        setUser(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
