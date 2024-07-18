import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

function ConsultaEntrega() {
  const [entregas, setEntregas] = useState([]);
  const [searchNumeroColega, setSearchNumeroColega] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');

  useEffect(() => {
    fetchEntregas();
  }, []);

  const fetchEntregas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/entregas');
      setEntregas(response.data);
    } catch (error) {
      console.error('Error al obtener las entregas:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const handleSearchByNumeroColega = (e) => {
    setSearchNumeroColega(e.target.value);
  };

  const handleSearchStartDateChange = (e) => {
    setSearchStartDate(e.target.value);
  };

  const handleSearchEndDateChange = (e) => {
    setSearchEndDate(e.target.value);
  };

  const handleDownloadExcel = () => {
    const filteredData = filteredEntregas.map((entrega) => ({
      'Colega que Entrega': entrega.colegaEntrega,
      'Número de Colega': entrega.numeroColega,
      Nombre: `${entrega.nombres} ${entrega.apellidos}`,
      'Boletos Entregados': entrega.cantidad,
      'Fecha de Entrega': formatDate(entrega.fecha),
      'Tipo de Boleto': entrega.tipoBoleto,
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entregas');

    XLSX.writeFile(workbook, 'Reporte_Entregas.xlsx');
  };

  const filteredEntregas = entregas.filter((entrega) => {
    if (searchNumeroColega && !entrega.numeroColega.includes(searchNumeroColega)) {
      return false;
    }
    if (searchStartDate && searchEndDate) {
      const entregaDate = new Date(entrega.fecha);
      const startDate = new Date(searchStartDate);
      const endDate = new Date(searchEndDate);
      return entregaDate >= startDate && entregaDate <= endDate;
    }
    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Consulta de Entregas</h1>

      <div className="mb-4 flex flex-col md:flex-row md:space-x-4 items-center justify-center space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Buscar por Número de Colega"
          value={searchNumeroColega}
          onChange={handleSearchByNumeroColega}
          className="p-2 border rounded w-64"
        />

        <input
          type="date"
          value={searchStartDate}
          onChange={handleSearchStartDateChange}
          className="p-2 border rounded w-64"
        />

        <input
          type="date"
          value={searchEndDate}
          onChange={handleSearchEndDateChange}
          className="p-2 border rounded w-64"
        />
      </div>

      <button
        onClick={handleDownloadExcel}
        className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center mx-auto"
      >
        <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
        Descargar Reporte Excel
      </button>

      <div className="overflow-x-auto mt-4">
        <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Colega que Entrega</th>
                <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Número de Colega</th>
                <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Boletos Entregados</th>
                <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Entrega</th>
                <th className="px-6 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo de Boleto</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntregas.map((entrega, index) => (
                <tr key={entrega.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{entrega.colegaEntrega}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{entrega.numeroColega}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{entrega.nombres} {entrega.apellidos}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{entrega.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{formatDate(entrega.fecha)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{entrega.tipoBoleto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ConsultaEntrega;
