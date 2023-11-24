import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import React from 'react';

const UserStatusComponent = ({ userId }) => {
  const user = useTracker(() => Meteor.users.findOne(userId));

  if (!user) {
    return null;
  }

  const status = user.status?.defaultStatus || 'offline';

  return <div>User is currently: {status}</div>;
};
export default UserStatusComponent;
