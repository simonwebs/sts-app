// imports/ui/pages/AdminPanel.js

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import CreateAdminForm from '../forms/CreateAdminForm';

const AdminPanel = () => {
  const isSuperAdmin = useTracker(() => {
    const userId = Meteor.userId();
    return Roles.userIsInRole(userId, ['super-admin']);
  }, []);

  if (!isSuperAdmin) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <CreateAdminForm />
    </div>
  );
};

export default AdminPanel;
