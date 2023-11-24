import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../general/AuthContext';
import Loading from '../../components/spinner/Loading';
import AdminDashboard from '../admin/AdminDashboard';

const ProtectedAdminDashboard = () => {
  const { currentUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!currentUser || !currentUser.roles.includes('admin')) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading || !currentUser || !currentUser.roles.includes('admin')) {
    return <Loading />;
  }

  return <AdminDashboard />;
};

export default ProtectedAdminDashboard;
