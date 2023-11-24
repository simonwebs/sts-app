import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { Image, Transformation } from 'cloudinary-react';
import UpdateProfileImage from '../updateData/UpdateProfileImage';
import UpdateBannerImage from '../updateData/UpdateBannerImage';
import TimeSince from '../../../components/TimeSince';

const AdminProfilePage = () => {
  const { userId: userIdFromParams } = useParams();
  const { loggedUser, isLoading: isLoggedUserLoading } = useLoggedUser();
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true);
  const imageRef = useRef(null);

  // Set up an intersection observer for lazy loading the banner image
  useEffect(() => {
    if (imageRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageLoaded(true);
            observer.unobserve(imageRef.current);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(imageRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Subscribe to the user's data and track loading state
  const user = useTracker(() => {
    const handler = Meteor.subscribe('userData', userIdFromParams);
    setLoading(!handler.ready());
    return Meteor.users.findOne({ _id: userIdFromParams });
  }, [userIdFromParams]);

  if (loading || isLoggedUserLoading) {
    return <div className='flex justify-center items-center'>Loading...</div>;
  }
  if (!user) {
    return <div className='flex justify-center items-center'>User not found.</div>;
  }

  const cloud_name = 'cedar-christian-bilingual-school';
  const profileImageId = user?.profile?.image;
 const bannerImageId = user?.profile?.bannerImage ? user.profile.bannerImage.split('/upload/').pop() : null;

// Inside the useEffect for IntersectionObserver
console.log(`Observing banner image: ${bannerImageId}`);

// Right before the return statement
console.log(`Banner Image Loaded: ${imageLoaded}`);
console.log(`Banner Image ID: ${bannerImageId}`);

  // Styles can be moved outside the component or into a CSS module
  const bannerStyle = {
    position: 'relative',
    width: '100%',
    height: '32vh',
    marginBottom: '8px',
    padding: '16px',
    borderRadius: '8px',
  };

  const updateButtonStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 10,
  };
   const defaultBannerImage = 'https://via.placeholder.com/1500x400';

     return (
    <div className='bg-gray-100 w-full dark:bg-gray-700 min-h-screen pt-16 pb-12 pl-5 pr-5'>
      <div ref={imageRef} style={bannerStyle} className="banner">
        {imageLoaded && bannerImageId ? (
          <Image
            cloud_name={cloud_name}
            publicId={bannerImageId}
            loading="lazy" 
            className="h-full w-full object-cover rounded-lg cursor-pointer"
            alt="Banner image"
          >
            <Transformation
              width="auto"
              crop="scale"
              quality="auto:good" 
              fetchFormat="auto" 
              secure={true}
              responsive={true}
            />
          </Image>
        ) : (
          // Use the default banner image when `bannerImageId` is not available
          <img
            src={defaultBannerImage}
            className="h-full w-full object-cover rounded-lg cursor-pointer"
            alt="Default banner"
          />
        )}
        {userIdFromParams === loggedUser?._id && (
          <div style={updateButtonStyle}>
            <UpdateBannerImage userId={userIdFromParams} />
          </div>
        )}
      </div>

      <div className="ml-4">
        <div className="relative w-16 h-16 sm:w-16 sm:h-16 md:w-24 md:h-24 mb-5 md:mb-0 md:float-left md:mr-4">
          {profileImageId ? (
            profileImageId.startsWith('data:') ? (
              <img
                src={profileImageId}
                className="h-16 sm:h-full w-16 sm:w-full rounded-full border-4 border-white cursor-pointer object-cover"
                alt="User profile"
              />
            ) : (
              <Image
                cloud_name={cloud_name}
                publicId={profileImageId}
                width="auto"
                crop="scale"
                quality="auto"
                fetchFormat="auto"
                secure
                dpr="auto"
                responsive
                className="h-16 sm:h-full w-16 sm:w-full rounded-full border-4 border-white cursor-pointer object-cover"
                alt="User profile"
              />
            )
          ) : (
            <p className="h-full w-full rounded-full bg-gray-300 flex items-center justify-center text-lg text-gray-500 cursor-pointer">No Image</p>
          )}
          <div className="absolute bottom-0 right-0 mb-[-size] mr-[-size] z-10">
           {userIdFromParams === loggedUser?._id && <UpdateProfileImage />}
          </div>
        </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.username}</h3>
      {userIdFromParams === loggedUser?._id && (
        <div className="mt-3 space-x-3">
            <div className="text-gray-700">
             {user.createdAt && (
      <div className="text-gray-700">
        <span className='text-lg text-gray-700 dark:text-gray-400'>
          Joined <TimeSince date={user.createdAt} />
        </span>
      </div>
    )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;