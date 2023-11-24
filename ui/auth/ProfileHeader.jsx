import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Image, Transformation } from 'cloudinary-react';
import TimeSince from '../components/TimeSince';
import { UserProfiles } from '../../api/collections/UserProfiles';
import UpdateProfileImage from '../pages/admin/updateData/UpdateProfileImage';
import UpdateBannerImage from '../pages/admin/updateData/UpdateBannerImage';

const ProfileHeader = () => {
  const { userId } = useParams();
  const cloudName = 'swed-dev'; // Replace with your actual cloud name
  const [imageVersion, setImageVersion] = useState(Date.now());

  // Function to refresh the profile image
  const refreshProfileImage = () => {
    setImageVersion(Date.now());
  };
  const { user, userProfile, isLoading, isCurrentUserProfile } = useTracker(() => {
    const noDataAvailable = { user: null, userProfile: null, isLoading: true, isCurrentUserProfile: false };

    if (!userId) {
   //   console.log('No userId provided');
      return noDataAvailable;
    }

    const userSubscription = Meteor.subscribe('userDetails', userId);
    if (!userSubscription.ready()) {
     // console.log('Subscription is not ready');
      return { ...noDataAvailable, isLoading: true };
    }

    const user = Meteor.users.findOne({ _id: userId });
    const userProfile = UserProfiles.findOne({ authorId: userId });
    const isLoading = !user || !userProfile;
    const isCurrentUserProfile = Meteor.userId() === userId;

    //console.log('User data:', user);
    //console.log('UserProfile data:', userProfile);

    return { user, userProfile, isLoading, isCurrentUserProfile };
  }, [userId, imageVersion]);

  //console.log('isLoading:', isLoading);
  //console.log('isCurrentUserProfile:', isCurrentUserProfile);
  const isOnline = user?.status?.online ?? false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
   // console.error('User profile not found for userId:', userId);
    return <div>User profile not found.</div>;
  }
  const refreshProfileDetails = () => {
    // Force the useTracker to re-run by updating the state that it depends on
    setImageVersion(Date.now());
  };
  // Check and log profile photos
 // console.log('Profile Photos:', userProfile.profilePhotos);

 const profileImageId = user?.profile?.image;
 const bannerImageId = user?.profile?.bannerImage ? user.profile.bannerImage.split('/upload/').pop() : null;
 const defaultBannerImage = "https://via.placeholder.com/150";
 const defaultProfileImage = "default_profile_image_public_id"; // Replace with your actual public ID if hosted on Cloudinary

 // Append the image version query parameter to force refresh
 const profileImageUrl = `${profileImageId || defaultProfileImage}?_v=${imageVersion}`;

 const userName = userProfile?.firstName || userProfile?.lastName || user?.username || 'Username not ready';
 
  return (
    <div className="bg-gray-100 w-full dark:bg-gray-700 mt-16 py-2 px-1">
      {/* Banner Image */}
      <div className="relative w-full h-56 overflow-hidden shadow-md">
        <Image
          cloudName={cloudName}
          publicId={bannerImageId || defaultBannerImage} 
          fetchFormat="auto"
          quality="auto"
          secure={true}
          responsive={true}
          width="auto"
          crop="scale"
          className="object-cover w-full h-full"
          alt="User's banner image"
        >
          <Transformation aspectRatio="16:9" crop="fill" />
        </Image>
        {isCurrentUserProfile && (
          <div className="absolute bottom-0 right-0 p-2">
            <UpdateBannerImage userId={userId} />
          </div>
        )}
      </div>
      {/* Profile Image and Details */}
      <div className="flex flex-col justify-center items-center -mt-20 mb-4">
        {/* Profile Image */}
        <div className="relative w-36 h-36 mx-auto">
          <Image
            cloudName={cloudName}
            publicId={profileImageId || defaultProfileImage} 
            width="auto"
            crop="scale"
            quality="auto"
            fetchFormat="auto"
            secure={true}
            dpr="auto"
            responsive={true}
            className="rounded-lg border-4 shadow-lg border-white object-cover"
            alt="User profile image"
            style={{ width: '148px', height: '148px' }}
          />
          {isCurrentUserProfile && (
            <div className="absolute -bottom-3 -right-3">
            <UpdateProfileImage onImageUpdated={refreshProfileDetails} />
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
          {userName}
        </h2>
        <p className={`text-sm ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
        {user?.status?.lastOnline && (
          <TimeSince date={user.status.lastOnline} className="text-xs text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
