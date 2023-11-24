// UserRolesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

export const UserRolesContext = createContext();

export const UserRolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  const { user } = useTracker(() => {
    const user = Meteor.user();
    return { user };
  }, []);

  useEffect(() => {
    if (user) {
      const userRoles = Roles.getRolesForUser(user._id);
      setRoles(userRoles);
    }
  }, [user]);

  return (
    <UserRolesContext.Provider value={roles}>
      {children}
    </UserRolesContext.Provider>
  );
};

export const useUserRoles = () => useContext(UserRolesContext);
