// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Route
      {...rest}
      element={token ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
