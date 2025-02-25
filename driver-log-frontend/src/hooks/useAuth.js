import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (e.g., check for token)
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            // Optionally fetch user data here
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setIsAuthenticated(true);
            // Optionally fetch and set user data
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}