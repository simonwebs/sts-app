import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';
import { FaEnvelope } from 'react-icons/fa';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
};

const UserDetails = () => {
  const { userId } = useParams();
  const { userProfile, isLoadingUserProfile } = useTracker(() => {
    const noDataAvailable = { userProfile: null, isLoadingUserProfile: true };
    if (!userId) return noDataAvailable;

    const subscription = Meteor.subscribe('allUsersDetails', userId);
    if (!subscription.ready()) {
      return { ...noDataAvailable, isLoadingUserProfile: true };
    }

    const userProfile = UserProfiles.findOne({ authorId: userId });
    return { userProfile, isLoadingUserProfile: false };
  }, [userId]);

  if (isLoadingUserProfile) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    console.error(`User profile not found for userId: ${userId}`);
    return <div>User profile not found.</div>;
  }

  const hasDisability = userProfile?.disability?.hasDisability;
  const disabilityDescription = userProfile?.disability?.disabilityDescription;
  const age = calculateAge(userProfile.birthDate);

  console.log('User Profile:', userProfile); // Log the entire user profile to check its structure

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden my-4 mx-2 md:mx-8 lg:mx-20 xl:mx-32">
      <div className="p-4 md:p-6 lg:p-8 border-t">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Personal Bio</span>
        <p className="mt-2 text-sm text-gray-900 dark:text-white">{userProfile.personalBio}</p>
      </div>

      <div className="p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg px-4 py-3 rounded-md">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</span>
            <span className="mt-1 text-sm text-gray-900 dark:text-white ml-4">{age}</span>
          </div>
<div className="bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg px-4 py-3 rounded-md">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</span>
            <span className="mt-1 text-sm text-gray-900 dark:text-white ml-4">{userProfile?.biologicalGender}</span>
          </div>

          {/* ... other items ... */}
        </div>

        <div className="flex flex-col space-y-4">
         {hasDisability !== undefined && (
          <div className="bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg px-4 py-3 rounded-md">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Has Disability</span>
            <span className="mt-1 text-sm text-gray-900 dark:text-white">{hasDisability ? 'Yes' : 'No'}</span>

            {hasDisability && (
              <>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Disability Description</span>
                <span className="mt-1 text-sm text-gray-900 dark:text-white">
                  {disabilityDescription || 'N/A'}
                </span>
              </>
            )}
          </div>
         )}
          {/* ... other items ... */}
        </div>
      </div>

      {/* Display Relationship Preferences */}
      <div className="bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg px-4 py-3 rounded-md">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship Preferences</span>
        <span className="mt-1 text-sm text-gray-900 dark:text-white ml-4">
          {userProfile.relationshipPreferences?.relationshipPreferences || 'N/A'}
        </span>
      </div>

     <div className="bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg px-4 py-3 grid grid-cols-1 gap-2 sm:grid-cols-2 rounded-md">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Interest</span>
      <span className="mt-1 text-sm text-gray-900 dark:text-white ml-4 sm:mt-0">
        {userProfile.interests?.length
          ? userProfile.interests.map((interest, index) => {
            console.log(`Interest[${index}]:`, interest); // Log each interest to check its structure
            return interest?.interestName || 'N/A';
          }).join(', ')
          : 'N/A'}
      </span>
    </div>

      <div className="bg-gray-50 dark:bg-gray-700 shadow-md hover:shadow-lg px-4 py-3 rounded-md">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Behavior</span>
        <span className="mt-1 text-sm text-gray-900 dark:text-white ml-4 sm:mt-0">
          {userProfile.behavior?.behavior || 'N/A'}
        </span>
      </div>

      {/* ... other items ... */}

      <div className="flex flex-col sm:flex-row justify-between items-center pt-4">
        {userProfile.email && (
          <a href={`mailto:${userProfile.email}`} className="text-blue-600 hover:text-blue-800">
            <FaEnvelope className="inline-block" /> {userProfile.email}
          </a>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
