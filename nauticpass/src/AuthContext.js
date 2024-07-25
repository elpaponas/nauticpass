// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Cambia la URL al endpoint que devuelve la información del usuario
          const response = await axios.get('http://localhost:5000/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setRole(response.data.role); // Si también necesitas el rol
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
