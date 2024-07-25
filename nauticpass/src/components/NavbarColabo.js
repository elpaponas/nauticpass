import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import LogoutButton from './LogoutButton';
import axios from 'axios';

function NavbarColabo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Suponiendo que guardaste el token en localStorage
        if (!token) {
          console.error('Token no encontrado');
          setLoading(false);
          return;
        }
        
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('/api/usuarios/me', config);
        
        console.log('Datos del usuario:', response.data); // Verificar los datos recibidos
        setUser(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInicioClick = () => {
    navigate('/dash');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y título */}
        <div className="flex items-center space-x-3">
          <FiSettings className="text-white text-3xl animate-spin" />
          <div className="text-white text-2xl font-bold">Sistema de Gestión de Boletos</div>
        </div>

        {/* Menú de navegación */}
        <div className="flex items-center space-x-6">
          <CustomNavLink to="/dash" onClick={handleInicioClick}>Inicio</CustomNavLink>
          <CustomNavLink to="/consultacolegas">Consulta de Colegas</CustomNavLink>
          <CustomNavLink to="/consultaentregas">Historial de Boletos</CustomNavLink>
          <CustomNavLink to="/entregaboletos">Entrega de Boletos</CustomNavLink>
        </div>

        {/* Nombre del usuario logueado */}
        <div className="text-white">
          {loading ? 'Cargando...' : user ? `Bienvenido, ${user.nombres} ${user.apellidos}` : 'Usuario no encontrado'}
        </div>

        {/* Botón de cierre de sesión */}
        <div className="ml-6">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

const CustomNavLink = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    className="text-white hover:text-gray-200 transition duration-300 ease-in-out font-medium px-3 py-2 relative"
    activeClassName="border-b-2 border-white"
    onClick={onClick}
  >
    {children}
  </NavLink>
);

export default NavbarColabo;
