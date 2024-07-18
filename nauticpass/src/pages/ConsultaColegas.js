import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import UserTableColaborador from '../components/UserTableColaborador';
import axios from 'axios';

function ConsultaColegas() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroColega: '',
    nombres: '',
    apellidos: '',
    puesto: '',
    codigo: ''
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchColaboradores();
  }, []);

  useEffect(() => {
    // Update filteredUsers when searchTerm or users change
    const filteredResults = users.filter(user =>
      user.numeroColega.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredResults);
  }, [searchTerm, users]);

  const fetchColaboradores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/colaboradores');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching colaboradores:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [generatedCodes, setGeneratedCodes] = useState([]);

  const generateRandomCode = () => {
    let randomCode;
    do {
      randomCode = Math.floor(Math.random() * 9000) + 1000; // Genera un número aleatorio de 4 dígitos
    } while (generatedCodes.includes(randomCode.toString()));
  
    // Agrega el código generado al registro
    setGeneratedCodes([...generatedCodes, randomCode.toString()]);
  
    // Actualiza el estado formData con el nuevo código generado
    setFormData({ ...formData, codigo: randomCode.toString() });
  };
  
  

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/colaboradores', formData);
      setUsers([...users, { ...formData, id: response.data.id }]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding colaborador:', error);
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
      await axios.put(`http://localhost:5000/api/colaboradores/${formData.id}`, formData);
      const updatedUsers = users.map(u => (u.id === formData.id ? formData : u));
      setUsers(updatedUsers);
      resetForm();
      setEditMode(false);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating colaborador:', error);
    }
  };

  const openConfirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const closeConfirmDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/colaboradores/${id}`);
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      closeConfirmDelete();
    } catch (error) {
      console.error('Error deleting colaborador:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      numeroColega: '',
      nombres: '',
      apellidos: '',
      puesto: '',
      codigo: ''
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Consulta de Colegas</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Agregar Colega
        </button>
        <input
          type="text"
          placeholder="Buscar por número de colega"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded"
        />
      </div>
      <UserTableColaborador
        users={filteredUsers} // Render filteredUsers instead of users
        onDelete={openConfirmDelete}
        onEdit={handleEditUser}
      />
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Editar Usuario' : 'Agregar Colega'}</h2>
            <form onSubmit={editMode ? handleUpdateUser : handleAddUser} className="flex flex-col space-y-4">
              <input
                type="text"
                name="numeroColega"
                placeholder="Número de Colega"
                value={formData.numeroColega}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="nombres"
                placeholder="Nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="apellidos"
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="puesto"
                placeholder="Puesto"
                value={formData.puesto}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  name="codigo"
                  placeholder="Código"
                  value={formData.codigo}
                  onChange={handleChange}
                  className="p-2 border rounded"
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={generateRandomCode}
                >
                  Generar Código
                </button>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> {editMode ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditMode(false); }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDeleteUser(confirmDeleteId)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Eliminar
              </button>
              <button
                onClick={closeConfirmDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-md ml-4"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaColegas;
