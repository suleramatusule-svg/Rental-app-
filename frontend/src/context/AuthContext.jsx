import React, { createContext, useContext, useState, useEffect } from 'react';
import { propertyService } from '../api/propertyService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Validate token and restore session on mount
        const initAuth = async () => {
            if (token) {
                try {
                    // We might want a specific /me endpoint, but for now we'll assume token validity 
                    // or fetch dashboard data to verify.
                    // Since dashboard endpoint returns user info:
                    const response = await fetch('http://localhost:5050/api/v1/dashboard', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData.all); // Backend returns { name, all: { ...userObj } }
                    } else {
                        logout();
                    }
                } catch (e) {
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const data = await propertyService.userLogin({ email, password });
            setToken(data.access_token);
            localStorage.setItem('token', data.access_token);

            // Fetch user details immediately
            const userResp = await fetch('http://localhost:5050/api/v1/dashboard', {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });
            if (userResp.ok) {
                const userData = await userResp.json();
                setUser(userData.all);
            }
            return true;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
