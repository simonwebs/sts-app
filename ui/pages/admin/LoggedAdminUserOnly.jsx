// @ts-nocheck
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { Loading } from '../../components/spinner/Loading';
import { AdminRoutes } from '../../common/general/AdminRoutes';

const LoggedAdminUserOnly = ({ children }) => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const location = useLocation();
  if (isLoadingLoggedUser) {
    return <Loading />;
  }
  if (!loggedUser) {
    return (
      <Navigate to={AdminRoutes.ADMIN_LOGIN} state={{ from: location }} replace />
    );
  }
  return children;
};
export default LoggedAdminUserOnly;
