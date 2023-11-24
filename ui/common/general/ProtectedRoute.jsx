// ProtectedRoute.jsx
import React from 'react';
import { useUserRoles } from './UserRolesContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const roles = useUserRoles();

  if (roles.includes('admin')) {
    return children; // If the user is an admin, render the children components
  } else {
    return <Navigate to="/unauthorized" />; // If not, redirect to an unauthorized page
  }
};

export default ProtectedRoute;
