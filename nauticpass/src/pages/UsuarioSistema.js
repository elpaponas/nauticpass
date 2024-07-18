import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faEdit, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function UsuarioSistema() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroColega: '',
    nombres: '',
    apellidos: '',
    puesto: '',
    role: 'Elige Rol',
    usuario: '', // Cambiado de 'email' a 'usuario'
    password: '',
    estado: true // Inicialmente habilitado
  });
  
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmToggleUserId, setConfirmToggleUserId] = useState(null);
  const [toggleAction, setToggleAction] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      numeroColega: '',
      nombres: '',
      apellidos: '',
      puesto: '',
      role: 'Elige Rol',
      usuario: '', // Cambiado de 'email' a 'usuario'
      password: '',
      estado: true // Inicialmente habilitado
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        ...formData,
        estado: true // Establecer como habilitado por defecto
      });
      setUsers([...users, { ...formData, id: response.data.id }]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  const handleEditUser = (user) => {
    setFormData(user);
    setEditMode(true);
    setShowForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${formData.id}`, formData);
      setUsers(users.map(u => (u.id === formData.id ? formData : u)));
      resetForm();
      setEditMode(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const updatedUser = { ...user, estado: !user.estado };
      await axios.put(`http://localhost:5000/api/users/${user.id}`, updatedUser);
      setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
      setConfirmToggleUserId(null);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const openConfirmToggle = (user) => {
    setToggleAction(user.estado ? 'deshabilitar' : 'habilitar');
    setConfirmToggleUserId(user.id);
  };

  const closeConfirmToggle = () => {
    setConfirmToggleUserId(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Usuarios del Sistema</h1>
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Agregar Usuario
      </button>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Número Colega</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombres</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Apellidos</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Puesto</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Contraseña</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={user.estado ? 'bg-white' : 'bg-red-100'}>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.numeroColega}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.nombres}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.apellidos}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.puesto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.usuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.password}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{user.estado ? 'Habilitado' : 'Deshabilitado'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(user.id)}
                      className="text-red-600 hover:text-red-900 mr-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      onClick={() => openConfirmToggle(user)}
                      className={`text-gray-600 hover:text-gray-900 ${user.estado ? 'mr-2' : 'opacity-50 cursor-not-allowed mr-2'}`}
                      title={user.estado ? 'Deshabilitar Usuario' : 'Habilitar Usuario'}
                    >
                      <FontAwesomeIcon icon={faBan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
            <form onSubmit={editMode ? handleUpdateUser : handleAddUser} className="space-y-4">
              <input
                type="text"
                name="numeroColega"
                placeholder="Número de Colega"
                value={formData.numeroColega}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                name="apellidos"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                name="puesto"
                placeholder="Puesto"
                value={formData.puesto}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-2 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="Elige Rol" disabled>Elige Rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Colaborador">Colaborador</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.293 5.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                name="usuario"
                placeholder="Usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="estado"
                  checked={formData.estado}
                  onChange={(e) => setFormData((prevData) => ({ ...prevData, estado: e.target.checked }))}
                  className="mr-2"
                />
                <label className="text-sm">Habilitado</label>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">{editMode ? 'Actualizar' : 'Agregar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <p className="text-lg font-bold mb-4">¿Estás seguro que deseas eliminar este usuario?</p>
            <div className="flex justify-end">
              <button onClick={() => setConfirmDeleteId(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Cancelar</button>
              <button onClick={() => handleDeleteUser(confirmDeleteId)} className="bg-red-500 text-white px-4 py-2 rounded-md">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {confirmToggleUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <p className="text-lg font-bold mb-4">
              ¿Estás seguro que deseas {toggleAction} este usuario?
            </p>
            <div className="flex justify-end">
              <button onClick={() => closeConfirmToggle()} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Cancelar</button>
              <button onClick={() => handleToggleUserStatus(users.find(u => u.id === confirmToggleUserId))} className={`bg-${toggleAction === 'habilitar' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded-md`}>
                {toggleAction === 'habilitar' ? 'Habilitar' : 'Deshabilitar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuarioSistema;
