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
  const [usuarioData, setUsuarioData] = useState({
    nombres: '',
    apellidos: ''
  });

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

  const fetchUsuarioData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/usuarios/me'); // Reemplaza con el endpoint correcto
      const { nombres, apellidos } = response.data;
      setUsuarioData({ nombres, apellidos });
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      // Manejo del error
    }
  };

  useEffect(() => {
    fetchUsuarioData();
    if (formData.numeroColega !== '') {
      fetchColaboradorData();
    }
  }, [formData.numeroColega]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchColaboradorData(); // Asegúrate de que los datos del colega estén actualizados
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
      }, 1000); // Tiempo en milisegundos (1 segundo en este caso)
    }
    return () => clearTimeout(timer);
  }, [showErrorAlert]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: 'url(/img/barco.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
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
                  type="text"
                  name="tipoBoleto"
                  value={formData.tipoBoleto}
                  onChange={handleChange}
                  className="rounded-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-center"
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                Confirmar
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-xl font-semibold mb-4">Confirmar Datos</h3>
              <p>¿Confirmas que los datos ingresados son correctos?</p>
              <p><strong>Código:</strong> {formData.codigo}</p>
              <Form.Group className="mb-3">
                <Form.Label>Ingrese el Código para Confirmar:</Form.Label>
                <Form.Control
                  type="text"
                  value={codigoIngresado}
                  onChange={handleCodigoChange}
                  className="mb-3"
                />
              </Form.Group>
              <div className="flex justify-between">
                <Button onClick={handleConfirmarCodigo} className="bg-blue-500 text-white rounded px-4 py-2">
                  Confirmar
                </Button>
                <Button onClick={handleCloseModal} className="bg-gray-500 text-white rounded px-4 py-2">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showCompletionAlert && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <strong className="font-bold">¡Éxito La entrega de boletos ha sido confirmada.!</strong>
              <span className="block sm:inline">.</span>
            </div>
          </div>
        )}

        {showErrorAlert && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error</strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntregaBoletos;
