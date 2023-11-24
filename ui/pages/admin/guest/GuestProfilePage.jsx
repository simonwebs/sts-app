import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { Image } from 'cloudinary-react';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const GuestProfilePage = () => {
  const { userId: userIdFromParams } = useParams();
  const { loggedUser } = useLoggedUser();
  const userId = userIdFromParams || loggedUser?._id;
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await new Promise((resolve, reject) => {
          Meteor.call('users.getUser', userId, (error, result) => {
            if (error) reject(error.reason);
            else resolve(result);
          });
        });
        setUser(user);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }
  const profileImageId = user?.profile?.image;
  const cloud_name = 'swed-dev';
  const bannerImageId = user?.profile?.bannerImage || 'vicrsissqls4pn8ggunn';

  return (
    <div className='bg-gray-100 dark:bg-gray-700 h-screen pt-20 pb-12 pl-5 pr-5'>
      <div className="relative banner w-full h-60 mb-8 p-4 rounded-lg">
        {bannerImageId ? (
          <Image
            cloud_name={cloud_name}
            publicId={bannerImageId}
            width="auto"
            crop="scale"
            quality="auto"
            fetchFormat="auto"
            secure
            dpr="auto"
            className="h-full w-full object-cover rounded-lg cursor-pointer"
          />
        ) : (
          <p className="h-full w-full bg-gray-300 flex items-center justify-center text-lg text-gray-500 cursor-pointer">No Banner Image</p>
        )}
      </div>

      <div className="ml-4">
        <div className="relative profile-pic w-16 h-16 sm:w-16 sm:h-16 md:w-24 md:h-24 mb-5 md:mb-0 md:float-left md:mr-4">
          {profileImageId ? (
            profileImageId.startsWith('data:') ? (
              <img
                src={profileImageId}
                className="h-16 sm:h-full w-16 sm:w-full rounded-full border-4 border-white shadow-md cursor-pointer object-cover"
                alt="User profile"
              />
            ) : (
              <Image
                cloudName={cloud_name}
                publicId={profileImageId}
                width="auto"
                crop="scale"
                quality="auto"
                fetchFormat="auto"
                secure
                dpr="auto"
                responsive
                className="h-16 sm:h-full w-16 sm:w-full rounded-full border-4 border-white shadow-md cursor-pointer object-cover"
                alt="User profile"
              />
            )
          ) : (
            <p className="h-full w-full rounded-full bg-gray-300 flex items-center justify-center text-lg text-gray-500 cursor-pointer">No Image</p>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{loggedUser?.username}</h3>
        {userId === loggedUser?._id && (
          <div className="mt-3 space-x-3">
            <div className="text-gray-700">
              <div className="text-gray-700">
                Created on{' '}
                <time dateTime={loggedUser?.createdAt} className="text-gray-500">
                  {new Date(loggedUser?.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestProfilePage;
