import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

const Discover = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useTracker(() => {
    const subscription = Meteor.subscribe('userProfiles.all');
    if (subscription.ready()) {
      const profiles = UserProfiles.find({ _id: { $ne: Meteor.userId() } }).fetch();
      if (isMounted.current) {
        setUserProfiles(profiles);
      }
    }
    return () => subscription.stop();
  }, []);

  const calculateAge = (birthDate) =>
    birthDate ? Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970) : 'N/A';

  return (
    <div className="bg-white dark:bg-gray-700">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Discover Members</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8">
        {userProfiles.map((profile) => (
  <div key={profile._id} className="group rounded-md overflow-hidden shadow-md relative">
    <Link to={`/profile/${profile.authorId || profile._id}`}>
      {/* Rest of the component remains unchanged */}
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={profile.profilePhotos[0]?.photoUrl || 'default-image-url'}
          alt={`${profile.firstName}'s profile`}
          className="h-full w-full object-cover object-center group-hover:opacity-75 cursor-pointer"
        />
        <div className="absolute bottom-0 right-0 p-2 flex items-center">
          <FaCamera className="text-white" />
          <span className="text-white ml-1">{profile.profilePhotos.length}</span>
        </div>
      </div>
    </Link>
              <div className="p-4 flex flex-col justify-between items-start">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">
                    {profile.firstName}, {calculateAge(profile.birthDate)}
                  </h3>
                  <span
                    className={`status-indicator h-4 w-4 rounded-full ${
                      profile.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></span>
                </div>
                <p id='line-clamp-2' className="text-gray-500 dark:text-gray-300">{profile.personalBio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
