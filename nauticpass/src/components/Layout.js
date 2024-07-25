import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Navbar from './Navbar';
import NavbarColabo from './NavbarColabo';

const Layout = ({ children }) => {
  const { role } = useContext(AuthContext);

  return (
    <div>
      {role === 'Administrador' ? <Navbar /> : role === 'Colaborador' ? <NavbarColabo /> : null}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
