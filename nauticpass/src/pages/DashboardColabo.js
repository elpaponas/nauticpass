import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTicketAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Importar Link desde react-router-dom

function DashboardColabo() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard de Colaborador</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {/* Cuadro de Consulta de Colaboradores */}
        <Link to="/consultacolegas" className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer transition-transform transform hover:-translate-y-2">
          <FontAwesomeIcon icon={faUsers} className="text-5xl text-green-500 mr-4" />
          <h2 className="text-xl font-bold">Consulta de Colegas</h2>
        </Link>
        {/* Cuadro de Consulta de Entrega de Boletos */}
        <Link to="/consultaentregas" className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer transition-transform transform hover:-translate-y-2">
          <FontAwesomeIcon icon={faClipboardList} className="text-5xl text-red-500 mr-4" />
          <h2 className="text-xl font-bold">Historial de Boletos</h2>
        </Link>
        {/* Cuadro de Entrega de Boletos */}
        <Link to="/entregaboletos" className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer transition-transform transform hover:-translate-y-2">
          <FontAwesomeIcon icon={faTicketAlt} className="text-5xl text-purple-500 mr-4" />
          <h2 className="text-xl font-bold">Entrega de Boletos</h2>
        </Link>
      </div>
    </div>
  );
}

export default DashboardColabo;
