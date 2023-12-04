import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Image, Transformation } from 'cloudinary-react';
import TimeSince from '../components/TimeSince';
import { PrivateMessages } from '../../api/collections/privateMessages.collection';
import { UserProfiles } from '../../api/collections/UserProfiles';
import UpdateProfileImage from '../pages/admin/updateData/UpdateProfileImage';
import UpdateBannerImage from '../pages/admin/updateData/UpdateBannerImage';
import ChatWindow from '../components/chat/ChatWindow';

const ProfileHeader = () => {
  const { userId } = useParams();
  const cloudName = 'swed-dev';
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const location = useLocation();

  const refreshProfileImage = () => {
    setImageVersion(Date.now());
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const { user, userProfile, isLoading, isCurrentUserProfile } = useTracker(() => {
    const noDataAvailable = { user: null, userProfile: null, isLoading: true, isCurrentUserProfile: false };

    if (!userId) {
      return noDataAvailable;
    }

    const userSubscription = Meteor.subscribe('userDetails', userId);
    if (!userSubscription.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const user = Meteor.users.findOne({ _id: userId });
    const userProfile = UserProfiles.findOne({ authorId: userId });
    const isLoading = !user || !userProfile;
    const isCurrentUserProfile = Meteor.userId() === userId;

    return { user, userProfile, isLoading, isCurrentUserProfile };
  }, [userId, imageVersion]);

  const refreshProfileDetails = () => {
    setImageVersion(Date.now());
  };

  useEffect(() => {
    const messageSubscription = Meteor.subscribe('privateMessages', Meteor.userId(), userId);

    const messageObserver = PrivateMessages.find(
      {
        $or: [
          { senderId: Meteor.userId(), receiverId: userId },
          { senderId: userId, receiverId: Meteor.userId() },
        ],
      },
      { sort: { timestamp: -1 } }
    ).observeChanges({
      added: (id, message) => {
        setNewMessage(message);
      },
    });

    return () => {
      messageSubscription.stop();
      messageObserver.stop();
    };
  }, [userId]);

  useEffect(() => {
    if (newMessage) {
      new Notification('New message', { body: newMessage.messageText });
    }
  }, [newMessage]);

  const isOnline = user?.status?.online ?? false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>User profile not found.</div>;
  }

  const profileImageId = user?.profile?.image;
  const bannerImageId = user?.profile?.bannerImage ? user.profile.bannerImage.split('/upload/').pop() : null;
  const defaultBannerImage = "https://via.placeholder.com/150";
  const defaultProfileImage = "https://via.placeholder.com/150";

  const profileImageUrl = `${profileImageId || defaultProfileImage}?_v=${imageVersion}`;

  const userName = userProfile?.firstName || userProfile?.lastName || user?.username || 'Username not ready';

  const showChatButton = !isCurrentUserProfile && location.pathname !== '/own-profile';

  return (
    <div className="bg-gray-100 w-full dark:bg-gray-700 mt-16 py-2 px-1">
      <div className="relative w-full h-56 overflow-hidden shadow-md">
        <Image
          cloudName={cloudName}
          publicId={bannerImageId || defaultBannerImage || profileImageUrl} 
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
      <div className="flex flex-col justify-center items-center -mt-20 mb-4">
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
      {showChatButton && (
        <button
          onClick={openChat}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Start Chat
        </button>
      )}
      {isChatOpen && (
        <ChatWindow selectedUser={user} onClose={closeChat} incomingMessages={[newMessage]} />
      )}
    </div>
  );
};

export default ProfileHeader;
