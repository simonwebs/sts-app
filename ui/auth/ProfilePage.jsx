import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileImageGallery from './ProfileImageGallery';
import UserDetails from './UserDetails';
import ProfileHeader from './ProfileHeader';
import LikeByComponent from './LikeByComponent';
import { Meteor } from 'meteor/meteor';
import { UsersCollection } from '../../api/collections/UserProfiles';

const ProfilePage = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);

  useTracker(() => {
    const subscription = Meteor.subscribe('allUsersDetails');

    if (subscription.ready()) {
      try {
        const currentUser = Meteor.users.findOne({ _id: userId });
        const userProfile = UsersCollection.findOne({ authorId: userId });

        setUserProfileData({ user: currentUser, userProfile });
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    }

    return () => {
      subscription.stop();
    };
  }, [userId]);

  if (loading) {
    return <div>Loading spinner or indicator...</div>;
  }

  if (error) {
    return <div>Error loading user profile: {error.message}</div>;
  }

  if (!userProfileData) {
    return <div>User profile not found.</div>;
  }

  const { user, userProfile } = userProfileData;
 const likedBy = [
    { id: 1, name: 'User1' },
    { id: 2, name: 'User2' },
    // ...
  ];

  const likedUsers = [
    { id: 3, name: 'User3' },
    { id: 4, name: 'User4' },
    // ...
  ];
  return (
    <main className="pb-8">
      <ProfileHeader user={user} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Page title</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="overflow-hidden rounded-lg bg-white shadow p-2">
                <UserDetails userId={userId} />
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow p-2 dark:bg-gray-700">
                <ProfileImageGallery user={user} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
               <LikeByComponent likedBy={likedBy} likedUsers={likedUsers} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
