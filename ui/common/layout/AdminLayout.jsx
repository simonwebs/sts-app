import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import Loading from '../../components/spinner/Loading';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const { user, roles, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('userRoles');
    const isLoading = !handle.ready();
    const user = Meteor.user();
    const roles = Roles.getRolesForUser(Meteor.userId());
    return { user, roles, isLoading };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user && roles.includes('admin')) {
        // User is authorized as an admin
      } else {
        // User is not authorized as an admin
        navigate('/unauthorized');
      }
    }
  }, [user, roles, isLoading, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>; // Only render children if authorized
};

export default AdminLayout;
