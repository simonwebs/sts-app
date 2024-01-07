import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Image, Transformation } from 'cloudinary-react';
import { Link, useNavigate } from 'react-router-dom';
import { CameraIcon } from '@heroicons/react/24/outline';
import { calculateAge } from '../auth/utils';

const Discover = ({ user, userId, authorId }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth >= 1024 ? 10 : 4;

  const userData = useTracker(() => {
    const usersSubscription = Meteor.subscribe('allUsersDetails');

    if (usersSubscription.ready()) {
      const users = Meteor.users.find({ _id: { $ne: userId } }).fetch();

      return {
        users,
        isLoading: false,
      };
    }

    return { users: [], isLoading: true };
  });

  const handleViewDetails = (authorId) => {
    navigate(`/profile/${authorId || user._id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [userId]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="container mx-auto p-4 dark:bg-gray-700">
      <h2 className="text-3xl font-semibold mb-4 dark:text-gray-300">Discover</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {userData.users.slice(startIndex, endIndex).map((user) => {
          const { profile = {}, status = {} } = user;
          const { username } = user;
          const images = profile?.images || [];
          const imageCount = images.length;

          return (
            <li
              key={user._id}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center relative group hover:shadow-lg hover:border-b hover:border-cyan-500 transition-shadow duration-300 ease-in-out"
            >
              <div className="mb-4 relative">
                <Link to={`/profile/${authorId || user._id}`} onClick={() => handleViewDetails(user._id)}>
                  {imageCount > 0
                    ? (
                    <>
                      <div className="relative group">
                        <Image
                          cloudName="techpulse"
                          publicId={images[imageCount - 1]?.publicId}
                          width="auto"
                          crop="scale"
                          quality="auto"
                          fetchFormat="auto"
                          secure={true}
                          responsive={true}
                          alt={`${username}'s Avatar`}
                          className="group-hover:opacity-70 transition-opacity rounded-lg duration-300 ease-in-out"
                        >
                          <Transformation aspectRatio="1:1" crop="fill" />
                        </Image>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                          <div className="text-sm font-semibold flex items-center">
                            <CameraIcon className="w-5 h-5 fill-cyan-50 mr-1" />
                            <span className="p-1 text-cyan-50">{imageCount}</span>
                          </div>
                        </div>
                   </div>
                    </>
                      )
                    : (
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                      )}
                </Link>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold mb-1 dark:text-gray-300">
                  {username}, {profile?.birthDate ? calculateAge(profile.birthDate) : 'N/A'}
                </p>
                <p className={`text-sm ${status?.online ? 'text-green-500' : 'text-red-500'} mb-1`}>
                  {status?.online ? 'Online' : 'Offline'}
                </p>
                <p id="line-clamp-2" className="text-sm mb-1 dark:text-gray-400">
                  {profile?.personalBio || 'No bio available'}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {userData.users.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(userData.users.length / itemsPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 border dark:border-gray-500 rounded ${currentPage === index + 1 ? 'bg-cyan-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;
