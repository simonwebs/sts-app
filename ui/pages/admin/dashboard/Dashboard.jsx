import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import Loading from '../../../components/spinner/Loading';
import AdminDashboard from '../dashboard/AdminDashboard';
import GuestDashboard from '../guest/GuestDashboard';

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, rolesReady, isLoading } = useTracker(() => {
    const loggingIn = Meteor.loggingIn();
    const userId = Meteor.userId();
    const rolesSub = userId && !loggingIn ? Meteor.subscribe('userRoles') : null;
    const user = Meteor.user();
    const rolesReady = rolesSub ? rolesSub.ready() : false;
    const isLoading = !userId || loggingIn || !rolesReady;
    return { user, rolesReady, isLoading };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (rolesReady) {
        if (Roles.userIsInRole(user._id, 'admin')) {
          // AdminDashboard will be rendered, no need to navigate
        } else {
          navigate('/'); // Navigate to home if no specific role is found
        }
      }
    }
  }, [user, rolesReady, isLoading, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  // After ensuring the user is not loading and roles are ready
  if (rolesReady) {
    if (Roles.userIsInRole(user?._id, 'admin')) {
      return <AdminDashboard />;
    }
  }

  // By default return GuestDashboard if no role or other roles
  return <GuestDashboard />;
};

export default Dashboard;
