// AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    role: null,
  });

  const login = async (email, password) => {
    const response = await axios.post('/api/login', { usuario, password });
    setAuthState({
      token: response.data.token,
      role: response.data.role,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login }}>
      {children}
    </AuthContext.Provider>
  );
};
