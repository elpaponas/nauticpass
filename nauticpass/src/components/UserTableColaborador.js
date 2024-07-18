import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserTableColaborador = ({ users, onDelete, onEdit }) => {
  // Verifica si users es undefined y asigna un array vacío si es así
  const usersArray = users || [];

  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número de Colega
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombres
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Apellidos
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Puesto
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usersArray.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.numeroColega}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.nombres}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.apellidos}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.puesto}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.codigo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                <button
                  onClick={() => onEdit(user)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTableColaborador;
