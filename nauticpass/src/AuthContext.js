import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setRole(response.data.role); // Asume que la respuesta tiene un campo `role`
        } catch (error) {
          console.error('Error fetching user data:', error);
          setRole(null); // En caso de error, no hay rol
        }
      } else {
        setRole(null); // No hay token, no hay rol
      }
      setLoading(false); // Finaliza la carga sin importar el resultado
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
