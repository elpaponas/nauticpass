// src/components/NavbarAdministrador.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import LogoutButton from './LogoutButton';

const NavbarAdministrador = () => (
  <nav className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <FiSettings className="text-white text-3xl animate-spin" />
        <div className="text-white text-2xl font-bold">Sistema de Gestión de Boletos</div>
      </div>
      <div className="flex items-center space-x-6">
        <CustomNavLink to="/dashboard">Inicio</CustomNavLink>
        <CustomNavLink to="/usuariosistema">Usuarios del Sistema</CustomNavLink>
        <CustomNavLink to="/consultacolegas">Consulta de Colegas</CustomNavLink>
        <CustomNavLink to="/consultaentregas">Historial de Boletos</CustomNavLink>
        <CustomNavLink to="/entregaboletos">Entrega de Boletos</CustomNavLink>
      </div>
      <div className="ml-6">
        <LogoutButton />
      </div>
    </div>
  </nav>
);

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

export default NavbarAdministrador;
