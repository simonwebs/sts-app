import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../../api/collections/UserProfiles';
import { FriendRequestsCollection } from '../../../api/collections/FriendRequestsCollection';
import { Meteor } from 'meteor/meteor';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const FriendRequests = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useTracker(() => {
    const userSub = Meteor.subscribe('userProfiles.all');
    const requestSub = Meteor.subscribe('friendRequests.toUser');
    if (userSub.ready() && requestSub.ready()) {
      const profiles = UserProfiles.find({ _id: { $ne: Meteor.userId() } }).fetch();
      const requests = FriendRequestsCollection.find({ toUserId: Meteor.userId() }).fetch();
      if (isMounted.current) {
        setUserProfiles(profiles);
        setFriendRequests(requests);
      }
    }
    return () => {
      userSub.stop();
      requestSub.stop();
    };
  }, []);


  const handleAccept = (requestId) => {
    Meteor.call('friendRequests.accept', requestId, (error) => {
      if (error) {
        console.error('Error accepting request:', error);
      } else {
        setFriendRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
      }
    });
  };

  const handleReject = (requestId) => {
    Meteor.call('friendRequests.reject', requestId, (error) => {
      if (error) {
        console.error('Error rejecting request:', error);
      } else {
        setFriendRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
      }
    });
  };

  const renderRequestButtons = (userId) => {
    const request = friendRequests.find(req => req.fromUserId === userId);
    if (request) {
      return (
        <div className="flex space-x-2 mt-4">
          <button onClick={() => handleAccept(request._id)} className="flex items-center bg-green-500 text-white rounded-md px-4 py-2">
            <FaCheckCircle className="mr-2" /> Accept
          </button>
          <button onClick={() => handleReject(request._id)} className="flex items-center bg-red-500 text-white rounded-md px-4 py-2">
            <FaTimesCircle className="mr-2" /> Reject
          </button>
        </div>
      );
    }
    return null;
  };

  const calculateAge = (birthDate) => birthDate ? Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970) : 'N/A';
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Discover Members</h2>
        <div className="flex overflow-x-auto py-4">
          {userProfiles.map(profile => (
            <div key={profile._id} className="group flex-none w-64 mr-4">
              <a href={`/profile/${profile._id}`} className="block relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={profile.profilePhotos[0]?.photoUrl || 'default-image-url'}
                    alt={`${profile.firstName}'s profile`}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white ${profile.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                </div>
              </a>
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-sm text-gray-700">{profile.firstName}</h3>
                <p className="text-lg font-medium text-gray-900">{calculateAge(profile.birthDate)}</p>
              </div>
              {renderRequestButtons(profile._id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;