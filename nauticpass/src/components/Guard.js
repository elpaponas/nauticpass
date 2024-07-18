import React from 'react';
import { Navigate } from 'react-router-dom';

function Guard({ condition, redirectTo, children }) {
  return condition ? children : <Navigate to={redirectTo} replace />;
}

export default Guard;
