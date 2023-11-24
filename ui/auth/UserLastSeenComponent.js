import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

const UserLastSeenComponent = ({ userId }) => {
  const user = useTracker(() => Meteor.users.findOne(userId));

  if (!user || !user.status?.lastLogin?.date) {
    return null;
  }

  const lastSeen = new Date(user.status.lastLogin.date).toLocaleString();

  return <div>Last seen: {lastSeen}</div>;
};
export default UserLastSeenComponent;
