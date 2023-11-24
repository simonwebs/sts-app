import React, { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { RoutePaths } from '../common/general/RoutePaths';

const Loading = lazy(() => import('../components/spinner/Loading'));

const AnonymousOnly = ({ children, redirectTo = RoutePaths.HOME }) => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const location = useLocation();
  if (isLoadingLoggedUser) {
    return <Loading />;
  }
  if (loggedUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  return children;
};

export default AnonymousOnly;
