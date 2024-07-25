// src/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi'; // Importamos el ícono de ajustes desde react-icons
import LogoutButton from './LogoutButton'; // Asegúrate de que el archivo esté en la misma carpeta

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y título */}
        <div className="flex items-center space-x-3">
          {/* Uso del ícono de ajustes con animación giratoria */}
          <FiSettings className="text-white text-3xl animate-spin" />
          <div className="text-white text-2xl font-bold">Sistema de Gestión de Boletos</div>
        </div>

        {/* Menú de navegación */}
        <div className="flex items-center space-x-6">
          <CustomNavLink to="/dashboard">Inicio</CustomNavLink>
          <CustomNavLink to="/usuariosistema">Usuarios del Sistema</CustomNavLink>
          <CustomNavLink to="/consultacolegas">Consulta de Colegas</CustomNavLink>
          <CustomNavLink to="/consultaentregas">Historial de Boletos</CustomNavLink>
          <CustomNavLink to="/entregaboletos">Entrega de Boletos</CustomNavLink>
        </div>

        {/* Botón de cierre de sesión */}
        <div className="ml-6">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

// Componente de enlace estilizado con animación y línea debajo
const CustomNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className="text-white hover:text-gray-200 transition duration-300 ease-in-out font-medium px-3 py-2 relative"
    style={({ isActive }) => ({
      borderBottom: isActive ? '2px solid white' : 'none',
    })}
  >
    {children}
  </NavLink>
);

export default Navbar;
