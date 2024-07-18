import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

function UserTable({ users, onDelete, onAdd, onEdit }) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Número de Colega</th>
          <th className="py-2">Nombres</th>
          <th className="py-2">Apellidos</th>
          <th className="py-2">Puesto</th>
          <th className="py-2">Rol</th>
          <th className="py-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td className="border px-4 py-2">{user.numeroColega}</td>
            <td className="border px-4 py-2">{user.nombres}</td>
            <td className="border px-4 py-2">{user.apellidos}</td>
            <td className="border px-4 py-2">{user.puesto}</td>
            <td className="border px-4 py-2">{user.rol}</td>
            <td className="border px-4 py-2 text-center">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                onClick={onAdd}
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                onClick={() => onEdit(user)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md"
                onClick={() => onDelete(user.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
