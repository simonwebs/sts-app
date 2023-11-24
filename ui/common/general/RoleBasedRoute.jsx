import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../common/general/AuthContext'; // Update with actual import path
import { RoutePaths } from './RoutePaths';

const RoleBasedRoute = ({ roles, children }) => {
  const { currentUser } = useAuth();

  // If currentUser is null, then it is still loading or there is no logged in user
  if (currentUser === null) {
    return null; // Or return a loading spinner
  }

  // If currentUser is not null but no user is logged in
  if (!currentUser) {
    //console.log("Navigating to Login"); // Debug
    return <Navigate to={RoutePaths.LOGIN_PAGE} replace />;
  }

  // Assuming currentUser.role contains the role of the logged user
  if (roles.includes(currentUser.role)) {
    //console.log("Role Matched, Rendering Children"); // Debug
    return children;
  }

  //console.log("Navigating to Not Allowed"); // Debug
  return <Navigate to={RoutePaths.NOT_ALLOWED} replace />;
};

export default RoleBasedRoute;
