// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import DashboardAdmi from './pages/DashboardAdmi';
import UsuarioSistema from './pages/UsuarioSistema';
import ConsultaColegas from './pages/ConsultaColegas';
import EntregaBoletos from './pages/EntregaBoletos';
import ConsultaEntrega from './pages/ConsultaEntrega';
import DashboardColabo from './pages/DashboardColabo';
import Navbar from './components/Navbar';
import NavbarColabo from './components/NavbarColabo';
import { AuthProvider, useAuth } from './AuthContext';

// Componente para redirigir al usuario basado en el rol
const RedirectBasedOnRole = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (role === 'Administrador') {
      navigate('/dashboard');
    } else if (role === 'Colaborador') {
      navigate('/dash');
    }
    setLoading(false);
  }, [role, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null; // No renderiza nada
};

const NavbarHandler = () => {
  const { role } = useAuth();
  const location = useLocation();

  // No mostrar el navbar en la página de login
  if (location.pathname === '/login') {
    return null;
  }

  return role === 'Administrador' ? <Navbar /> : <NavbarColabo />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <RedirectBasedOnRole />
          <Routes>
            {/* Renderiza el NavbarHandler en cada ruta, excepto login */}
            <Route
              path="*"
              element={
                <>
                  <NavbarHandler />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<DashboardAdmi />} />
                    <Route path="/consultacolegas" element={<ConsultaColegas />} />
                    <Route path="/entregaboletos" element={<EntregaBoletos />} />
                    <Route path="/consultaentregas" element={<ConsultaEntrega />} />
                    <Route path="/usuariosistema" element={<UsuarioSistema />} />
                    <Route path="/dash" element={<DashboardColabo />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
