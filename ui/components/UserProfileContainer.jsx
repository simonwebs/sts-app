import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import AuthorProfileImage from '../pages/AuthorProfileImage';

const UserProfileContainer = () => {
  const cloudName = 'techpulse';
  // Subscribe to user profiles publication
  const { userProfiles, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('allUserProfiles');
    const isLoading = !subscription.ready();
    const userProfiles = Meteor.users.find({}).fetch();
    return { userProfiles, isLoading };
  }, []);

  if (isLoading) {
    return <div>Loading user profiles...</div>;
  }

  return (
    <div>
      {userProfiles.map((user) => (
        <AuthorProfileImage
          key={user._id}
          cloudName={cloudName}
          authorImage={user.profile.image}
          size={60}
        />
      ))}
    </div>
  );
};

export default UserProfileContainer;
