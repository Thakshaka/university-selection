import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in (e.g., by checking for a token in localStorage)
        const token = localStorage.getItem('authToken');
        if (token) {
          setIsLoggedIn(true);
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        setIsLoggedIn(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUser(null);
    };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};