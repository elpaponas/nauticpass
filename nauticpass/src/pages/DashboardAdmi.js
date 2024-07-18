import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faTicketAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function DashboardAdmi() {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-400 min-h-screen py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-white text-center">Dashboard de Administrador</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cuadro de Usuarios del Sistema */}
          <Link to="/usuariosistema" className="bg-white bg-opacity-80 rounded-lg shadow-md flex items-center justify-center p-8 cursor-pointer transition-transform transform hover:-translate-y-2">
            <FontAwesomeIcon icon={faUser} className="text-5xl text-blue-500 mr-4" />
            <h2 className="text-xl font-bold">Usuarios del Sistema</h2>
          </Link>
          {/* Cuadro de Consulta de Colaboradores */}
          <Link to="/consultacolegas" className="bg-white bg-opacity-80 rounded-lg shadow-md flex items-center justify-center p-8 cursor-pointer transition-transform transform hover:-translate-y-2">
            <FontAwesomeIcon icon={faUsers} className="text-5xl text-green-500 mr-4" />
            <h2 className="text-xl font-bold">Consulta de Colegas</h2>
          </Link>
          {/* Cuadro de Consulta de Entrega de Boletos */}
          <Link to="/consultaentregas" className="bg-white bg-opacity-80 rounded-lg shadow-md flex items-center justify-center p-8 cursor-pointer transition-transform transform hover:-translate-y-2">
            <FontAwesomeIcon icon={faClipboardList} className="text-5xl text-red-500 mr-4" />
            <h2 className="text-xl font-bold">Historial de Boletos</h2>
          </Link>
          {/* Cuadro de Entrega de Boletos */}
          <Link to="/entregaboletos" className="bg-white bg-opacity-80 rounded-lg shadow-md flex items-center justify-center p-8 cursor-pointer transition-transform transform hover:-translate-y-2">
            <FontAwesomeIcon icon={faTicketAlt} className="text-5xl text-purple-500 mr-4" />
            <h2 className="text-xl font-bold">Entrega de Boletos</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmi;
