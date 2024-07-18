import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import DashboardAdmi from './pages/DashboardAdmi';
import UsuarioSistema from './pages/UsuarioSistema';
import ConsultaColegas from './pages/ConsultaColegas';
import EntregaBoletos from './pages/EntregaBoletos';
import ConsultaEntrega from './pages/ConsultaEntrega';
import Navbar from './components/Navbar';
import DashboardColabo from './pages/DashboardColabo';
import NavbarColabo from './components/NavbarColabo';
import { AuthProvider, AuthContext } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <AuthWrapper>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardAdmi />} />
                    <Route path="/usuariosistema" element={<UsuarioSistema />} />
                    <Route path="/consultacolegas" element={<ConsultaColegas />} />
                    <Route path="/entregaboletos" element={<EntregaBoletos />} />
                    <Route path="/consultaentregas" element={<ConsultaEntrega />} />
                    <Route path="/dash" element={<DashboardColabo />} />
                  </Routes>
                </AuthWrapper>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const AuthWrapper = ({ children }) => {
  const { role } = useContext(AuthContext);
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" />;
  } 

  if (role === 'Colaborador' && (location.pathname === '/dash' || location.pathname === '/usuariosistema')) {
    return <Navigate to="/dashboard" />;
  } 
  
  if (role === 'Administrador' && location.pathname === '/dashboard') {
    return <Navigate to="/dash" />;
  }

  return (
    <>
      {role === 'Administrador' ? <NavbarColabo /> : <Navbar />}
      {children}
    </>
  );
};

export default App;
