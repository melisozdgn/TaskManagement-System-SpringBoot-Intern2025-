import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from "../../services/authService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, email, ... }
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.sub }); // Adjust if your JWT uses a different field
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
        const data = await authService.login(username, password);
        setToken(data.token);
        localStorage.setItem("token", data.token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authService.register(username, email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        register,
        logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

// TODO: Decode JWT to get real user info instead of hardcoding username