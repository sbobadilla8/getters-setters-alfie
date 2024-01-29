import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

function RequireAuth({ allowedRoles }) {
  const { auth, init } = useAuth();
  if (init) {
    return null;
  }
  return allowedRoles?.includes(auth.role) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorised" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default RequireAuth;
