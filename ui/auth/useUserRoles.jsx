// client/hooks/useUserRoles.js
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const useUserRoles = () => {
  const roles = useTracker(() => {
    const noDataAvailable = { roles: [] };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    
    const handler = Meteor.subscribe('userRoles');
    
    if (!handler.ready()) {
      return noDataAvailable;
    }
    
    const user = Meteor.user();
    return { roles: user ? user.roles : [] };
  });
  
  return roles;
};
