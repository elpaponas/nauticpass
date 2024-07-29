// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import DashboardAdmi from './pages/DashboardAdmi';
import UsuarioSistema from './pages/UsuarioSistema';
import ConsultaColegas from './pages/ConsultaColegas';
import EntregaBoletos from './pages/EntregaBoletos';
import ConsultaEntrega from './pages/ConsultaEntrega';
import DashboardColabo from './pages/DashboardColabo';
import NavbarColaborador from './components/NavbarColaborador';
import { AuthProvider, useAuth } from './AuthContext';

// Componente para manejar la redirección y mostrar el Navbar
const NavbarHandler = () => {
  const location = useLocation();
  
  // No mostrar el navbar en la página de login
  if (location.pathname === '/login') {
    return null;
  }

  return <NavbarColaborador />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <>
                  <NavbarHandler />
                  <Routes>
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
