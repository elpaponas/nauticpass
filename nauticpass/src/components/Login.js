import React from 'react';
import axios from 'axios';

const Login = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const usuario = event.target.usuario.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:5000/api/login', { usuario, password });
      const { token, role } = response.data;

      // Almacenar el token y rol según sea necesario
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      // Redirigir a la página correspondiente según el rol
      if (role === 'Administrador') {
        // Redirigir al dashboard de administrador
        window.location.href = '/dashboard';
      } else if (role === 'Colaborador') {
        // Redirigir al dashboard de colaborador
        window.location.href = '/dash';
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      // Manejar el error de inicio de sesión, como mostrar un mensaje al usuario
      alert('Credenciales inválidas o error en el servidor');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(/img/mar.jpg)' }}
    >
      {/* Imagen del logo fuera de la tarjeta */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
        <img
          src="/img/se.png"
          alt="Logo"
          className="w-80 h-auto object-contain"
          style={{ marginBottom: '1rem' }} // Ajusta la distancia entre la imagen y la tarjeta
        />
      </div>
      
      <div className="w-full max-w-md p-8 bg-white bg-opacity-70 shadow-xl rounded-3xl border border-gray-300 transform transition-all duration-500 hover:scale-105 relative z-10 flex items-center justify-center">
        <div className="space-y-6 w-full">
          {/* Imagen de usuario */}
          <div className="flex justify-center mb-6">
            <img src="/img/usuario.png" alt="Usuario" className="w-24 h-24 object-cover rounded-full" />
          </div>
          
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block text-gray-800 font-medium mb-2">Usuario:</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition duration-300 ease-in-out transform hover:scale-105"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-800 font-medium mb-2">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition duration-300 ease-in-out transform hover:scale-105"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-3xl shadow-md hover:bg-blue-700 transform transition duration-300 ease-in-out hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
