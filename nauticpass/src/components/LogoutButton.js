// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; // Ícono de cerrar sesión

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Mostrar alerta de confirmación
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      // Aquí podrías agregar lógica para cerrar sesión (e.g., eliminar token, limpiar estado)
      navigate('/login'); // Redirige a la página de login
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
    >
      <FiLogOut className="text-lg mr-2" />
      Cerrar Sesión
    </button>
  );
}

export default LogoutButton;
