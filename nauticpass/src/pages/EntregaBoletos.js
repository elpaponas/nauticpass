import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function EntregaBoletos() {
  const [formData, setFormData] = useState({
    colegaEntrega: '',
    numeroColega: '',
    nombres: '',
    apellidos: '',
    puesto: '',
    fecha: '',
    cantidad: '',
    tipoBoleto: '',
    codigo: ''
  });

  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchColaboradorData = async () => {
    const { numeroColega } = formData;
    if (numeroColega !== '') {
      try {
        const response = await axios.get(`http://localhost:5000/api/colaboradores/${numeroColega}`);
        const { nombres, apellidos, puesto, codigo } = response.data;
        setFormData((prevData) => ({
          ...prevData,
          nombres,
          apellidos,
          puesto,
          codigo
        }));
      } catch (error) {
        console.error('Error al obtener datos del colega:', error);
        // Manejo del error
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCodigoChange = (e) => {
    setCodigoIngresado(e.target.value);
  };

  const handleConfirmarCodigo = async () => {
    if (codigoIngresado === formData.codigo) {
      try {
        const response = await axios.post('http://localhost:5000/api/entregas', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Respuesta del servidor:', response.data);
        setShowCompletionAlert(true);
        setFormData({
          colegaEntrega: '',
          numeroColega: '',
          nombres: '',
          apellidos: '',
          puesto: '',
          fecha: '',
          cantidad: '',
          tipoBoleto: ''
        });
        setCodigoIngresado('');
        setShowModal(false);
        setTimeout(() => setShowCompletionAlert(false), 2000); // Desaparece la alerta de completado después de 2 segundos
      } catch (error) {
        console.error('Error al enviar los datos:', error);
        setErrorMessage('Error al enviar los datos. Inténtelo nuevamente.');
        setShowErrorAlert(true);
        // Manejo del error
      }
    } else {
      setErrorMessage('El código ingresado no coincide. Inténtelo nuevamente.');
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    let timer;
    if (showErrorAlert) {
      timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 1000); // Tiempo en milisegundos (3 segundos en este caso)
    }
    return () => clearTimeout(timer);
  }, [showErrorAlert]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: 'url(/img/fondo.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md bg-opacity-60">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Entrega de Boletos</h1>
          <p className="text-gray-600 text-sm">Complete el formulario para continuar</p>
        </div>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Colega que Entrega</Form.Label>
                <Form.Control
                  type="text"
                  name="colegaEntrega"
                  value={formData.colegaEntrega}
                  onChange={handleChange}
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Número de Colega</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroColega"
                  value={formData.numeroColega}
                  onChange={handleChange}
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Nombres</Form.Label>
                <Form.Control
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  readOnly
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  readOnly
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Puesto</Form.Label>
                <Form.Control
                  type="text"
                  name="puesto"
                  value={formData.puesto}
                  readOnly
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-1">Tipo de Boleto</Form.Label>
                <Form.Control
                  as="select"
                  name="tipoBoleto"
                  value={formData.tipoBoleto}
                  onChange={handleChange}
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                >
                  <option value="">Seleccionar Tipo</option>
                  <option value="Sencillo">Sencillo</option>
                  <option value="Redondo">Redondo</option>
                </Form.Control>
              </Form.Group>
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  onClick={fetchColaboradorData}
                  className="w-full py-2 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 mr-2"
                >
                  Obtener Datos
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full py-2 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 ml-2"
                >
                  Entregar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
              <h2 className="text-center text-xl font-bold mb-4">Confirmar Código</h2>
              <input
                type="text"
                className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center mb-4"
                placeholder="Ingrese el código de confirmación"
                value={codigoIngresado}
                onChange={handleCodigoChange}
              />
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="w-1/2 py-2 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmarCodigo}
                  className="w-1/2 py-2 rounded-full bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showCompletionAlert && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mr-4" />
                <h2 className="text-green-500 text-2xl font-bold">Entrega completada</h2>
              </div>
            </div>
          </div>
        )}

        {showErrorAlert && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
              <p className="text-center text-red-500 text-xl font-bold">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntregaBoletos;
