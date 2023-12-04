import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { Meteor } from 'meteor/meteor';

const Discover = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [requestStatus, setRequestStatus] = useState({});
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

  useEffect(() => {
    userProfiles.forEach(profile => {
      Meteor.call('friendRequests.getStatus', profile._id, (error, status) => {
        if (!error && isMounted.current) {
          setRequestStatus(prevStatus => ({ ...prevStatus, [profile._id]: status }));
        }
      });
    });
  }, [userProfiles]);

  const handleRequest = (userId) => {
    console.log(`Sending friend request to user: ${userId}`);
    Meteor.call('friendRequests.send', userId, (error, requestId) => {
      if (!error) {
        console.log(`Friend request sent successfully to user: ${userId}, Request ID: ${requestId}`);
        setRequestStatus(prevStatus => ({ ...prevStatus, [userId]: { status: 'pending', requestId } }));
      } else {
        console.error(`Error sending friend request to user: ${userId}`, error);
        if (error.error === 'Request already sent or connected') {
          const newStatus = error.message.includes('already sent') ? 'pending' : 'connected';
          setRequestStatus(prevStatus => ({ ...prevStatus, [userId]: { status: newStatus } }));
        }
      }
    });
  };

  const handleCancelRequest = (userId) => {
    const requestId = requestStatus[userId]?.requestId;
    if (requestId) {
      Meteor.call('friendRequests.cancel', requestId, (error) => {
        if (!error) {
          setRequestStatus(prevStatus => ({ ...prevStatus, [userId]: { status: 'cancelled' } }));
        }
      });
    }
  };

  const renderButton = (userId) => {
    const status = requestStatus[userId]?.status;
    switch (status) {
      case 'pending':
        return (
          <div className="flex space-x-2 mt-4">
            <button className="bg-yellow-500 text-white rounded-md px-4 py-2">Pending</button>
            <button
              onClick={() => handleCancelRequest(userId)}
              className="bg-red-500 text-white rounded-md px-4 py-2"
            >
              Cancel Request
            </button>
          </div>
        );
      case 'accepted':
        return <button className="mt-4 w-full bg-green-500 text-white rounded-md px-4 py-2">Connected</button>;
      case 'rejected':
      case 'cancelled':
        return (
          <button
            onClick={() => handleRequest(userId)}
            className="mt-4 w-full bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Send Request
          </button>
        );
      default:
        return (
          <button
            onClick={() => handleRequest(userId)}
            className="mt-4 w-full bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Send Request
          </button>
        );
    }
  };

  const truncateBio = (bio, maxLength = 100) => bio && bio.length > maxLength ? bio.substring(0, maxLength) + '...' : bio;
  const calculateAge = (birthDate) => birthDate ? Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970) : 'N/A';

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Discover Members</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {userProfiles.map(profile => (
            <div key={profile._id} className="group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={profile.profilePhotos[0]?.photoUrl || 'default-image-url'}
                  alt={`${profile.firstName}'s profile`}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-sm text-gray-700">{profile.firstName}</h3>
                <p className="text-lg font-medium text-gray-900">{calculateAge(profile.birthDate)}</p>
                <span className={`status-indicator ${profile.isOnline ? 'online' : 'offline'}`}></span>
              </div>
              <p className="text-gray-500">Bio: {truncateBio(profile.personalBio)}</p>
              {renderButton(profile._id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
