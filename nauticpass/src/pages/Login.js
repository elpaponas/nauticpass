import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChangeUsuario = (e) => {
    setUsuario(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        usuario,
        password
      });

      const { status, message, user } = response.data;

      if (status === 'error') {
        setError(message);
        return;
      }

      const { role } = user;

      localStorage.setItem('role', role); // Guardar el rol del usuario en localStorage

      switch (role) {
        case 'Administrador':
          navigate('/dashboard');
          break;
        case 'Colaborador':
          navigate('/dash');
          break;
        default:
          setError('Rol no reconocido');
          break;
      }
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <input 
            type="text" 
            value={usuario} 
            onChange={handleChangeUsuario} 
            required 
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={handleChangePassword} 
            required 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
