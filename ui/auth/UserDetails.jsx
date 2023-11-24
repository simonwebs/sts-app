import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Image } from 'cloudinary-react';
import { FaEnvelope, FaUserCircle } from 'react-icons/fa';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const UserDetails = () => {
  const cloud_name = 'swed-dev'; // Replace with your actual cloud name

  const { userId } = useParams();
  const { userProfile, isLoadingUserProfile } = useTracker(() => {
    const noDataAvailable = { userProfile: null, isLoadingUserProfile: true };
    if (!userId) return noDataAvailable;
  
    const subscription = Meteor.subscribe('userProfileDetails', userId);
    if (!subscription.ready()) {
      return { ...noDataAvailable, isLoadingUserProfile: true };
    }
  
    const userProfile = UserProfiles.findOne({ authorId: userId });
    return { userProfile, isLoadingUserProfile: false };
  }, [userId]);
  
  if (isLoadingUserProfile) {
    return <div>Loading...</div>;
  }

  const setProfileImage = (photoUrl) => {
    Meteor.call('userProfiles.setProfileImage', userId, photoUrl, (error, result) => {
      if (error) {
        console.error('Error updating profile image:', error);
      } else {
        // Handle successful update, e.g., show a notification
        console.log('Profile image updated successfully');
      }
    });
  };

  if (!userProfile) {
    console.error(`User profile not found for userId: ${userId}`);
    return <div>User profile not found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden my-4">
      {/* Profile information rendering here */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
          <div className="pt-2 pb-2">
  <div className="bg-gray-50 dark:bg-gray-700 shadow-lg px-2 py-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</span>
    <span className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0">{userProfile.firstName}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</span>
    <span className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0">{userProfile.lastName}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</span>
    <span className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0">
  {formatDate(userProfile.birthDate)}
</span>

  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Biological Gender</span>
    <span className="block mt-1 text-sm text-gray-900 dark:text-white">{userProfile?.biologicalGender}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Body Height</span>
    <span className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0">{userProfile.bodyHeight}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Personal Bio</span>
    <span className="block mt-1 text-sm text-gray-900 dark:text-white">{userProfile.personalBio}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Looking For Gender</span>
    <span className="block mt-1 text-sm text-gray-900 dark:text-white">{userProfile.lookingForGender}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Age Preference</span>
    <span className="block mt-1 text-sm text-gray-900 dark:text-white">{userProfile.agePreferenceMin}</span>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Maximum Age Preference</span>
    <span className="block mt-1 text-sm text-gray-900 dark:text-white">{userProfile.agePreferenceMax}</span>
  </div>
  <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
    {/* Assuming you want to display email and phone, if available in userProfile */}
    {userProfile.email && (
          <a href={`mailto:${userProfile.email}`} className="text-blue-600 hover:text-blue-800">
            <FaEnvelope className="inline-block" /> {userProfile.email}
          </a>
        )}
  </div>
</div>

          </div>
          <div className="col-span-1">
          <div className="p-4 md:p-6 lg:p-8 border-t">
        <h3 className="text-lg font-semibold mb-2">Photos</h3>
        <div className="grid grid-cols-2 gap-2">
        {userProfile.profilePhotos.map((photo, index) => (
          <div key={photo.photoId || index} className="relative">
            <Image
              cloud_name={cloud_name}
              publicId={photo.photoUrl}
              width="auto"
              crop="scale"
              quality="auto"
              fetchFormat="auto"
              secure
              dpr="auto"
              responsive
              className="object-cover object-center w-full h-20 md:h-32 rounded-md"
              alt="Profile"
            />
            <button
              className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 text-white"
              onClick={() => setProfileImage(photo.photoUrl)}
              title="Set as Profile Image"
            >
              <FaUserCircle />
            </button>
          </div>
        ))}

        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
