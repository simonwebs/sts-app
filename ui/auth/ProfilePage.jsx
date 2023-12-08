import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';
import UserDetails from './UserDetails';
import ProfileHeader from './ProfileHeader';
import MatchList from './MatchList';

const ProfilePage = () => {
  const { userId } = useParams();
  const { userProfileData, isLoading } = useTracker(() => {
    const noDataAvailable = { userProfileData: null, isLoading: true };
    const subscription = Meteor.subscribe('userDetails', userId);
    if (subscription.ready()) {
      const user = Meteor.users.findOne({ _id: userId });
      const userProfile = UserProfiles.findOne({ userId });
      return { userProfileData: { user, userProfile }, isLoading: false };
    }
    return noDataAvailable;
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfileData) {
    return <div>User profile not found.</div>;
  }

  return (
    <>
      <main className="pb-8">
        <ProfileHeader user={userProfileData.user} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="sr-only">Page title</h1>
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
              <section aria-labelledby="section-1-title">
                <h2 className="sr-only" id="section-1-title">Section title</h2>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="p-2">
                    <UserDetails userId={userId} />
                  </div>
                </div>
              </section>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <section aria-labelledby="section-2-title">
                <h2 className="sr-only" id="section-2-title">Section title</h2>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="p-6">
                  <MatchList />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
