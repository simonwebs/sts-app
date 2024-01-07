import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UsersCollection } from '../../api/collections/UsersCollection';
import ChatWindow from '../components/chat/ChatWindow';
import { useParams, Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import { PrivateMessages } from '../../api/collections/privateMessages.collection';

const cloudName = 'swed-dev';

const getLatestMessages = (currentUserId, users) => {
  const latestMessages = [];
  users.forEach((user) => {
    const lastMessage = PrivateMessages.findOne(
      {
        $or: [
          { $and: [{ senderId: currentUserId }, { receiverId: user._id }] },
          { $and: [{ senderId: user._id }, { receiverId: currentUserId }] },
        ],
      },
      { sort: { createdAt: -1 } }
    );

    latestMessages.push({
      userId: user._id,
      messageText: lastMessage?.text || '',
      read: lastMessage?.read || false,
      createdAt: lastMessage?.createdAt || null,
    });
  });

  return latestMessages;
};

const UserContact = ({ onUserSelect }) => {
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const userProfilesSub = Meteor.subscribe('userContacts');
    const privateMessagesSub = Meteor.subscribe('privateMessages');
    return () => {
      userProfilesSub.stop();
      privateMessagesSub.stop();
    };
  }, []);

  const { users: usersWithLatestMessage, isLoading } = useTracker(() => {
    if (!Meteor.user()) {
      return { users: [], isLoading: true };
    }

    const handler = Meteor.subscribe('allUsersDetails');
    if (!handler.ready()) {
      return { users: [], isLoading: true };
    }

    const currentUserId = Meteor.userId();
    const users = UsersCollection.find(
      { _id: { $ne: currentUserId } },
      { fields: { username: 1, profile: 1, status: 1, createdAt: 1 } }
    ).fetch();

    const latestMessages = getLatestMessages(currentUserId, users);

    const usersWithLatestMessage = users.map((user) => {
      const latestMessage = latestMessages.find((msg) => msg.userId === user._id);
      const unreadCount = latestMessages.filter(
        (msg) => !msg.read && msg.userId !== currentUserId
      ).length;

      return { ...user, latestMessage, unreadCount };
    });

    return { users: usersWithLatestMessage, isLoading: false };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    onUserSelect(user);
  };
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {usersWithLatestMessage.map((otherUser) => (
          <li key={otherUser._id}>
            <div className="relative pb-8">
              <div className="relative flex space-x-3">
                <div>
                  <Image
                    cloudName={cloudName}
                    publicId={otherUser.profile?.image || 'default-profile-image'}
                    width="48"
                    height="48"
                    crop="scale"
                    quality="auto"
                    fetchFormat="auto"
                    secure={true}
                    dpr="auto"
                    responsive={true}
                    className={`
                      bg-gray-400 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                      rounded-full
                      transition-all duration-300 ease-in-out transform
                    `}
                    style={{ zIndex: 1, transform: 'scale(1)' }}
                    alt="User profile image"
                    loading="lazy"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(3)';
                      e.currentTarget.style.zIndex = '1000';
                      e.currentTarget.style.position = 'fixed';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = '1';
                      e.currentTarget.style.position = 'static';
                    }}
                  />
                  {otherUser.status === 'online' && (
                    <span className="bg-green-500 h-2 w-2 rounded-full absolute bottom-0 right-0"></span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <Link
                      to={`/profile/${otherUser._id}`}
                      className="text-sm text-gray-500 dark:text-gray-300 ml-3 cursor-pointer"
                    >
                      {otherUser.username}{' '}
                      <span className="font-medium text-gray-900">
                        {/* ... (previous code) */}
                      </span>
                      <br />
                      {otherUser.profile && (
                        <span
                          className={`font-bold ${
                            otherUser.unreadCount ? 'user-contact-unread' : ''
                          }`}
                          onClick={() => handleSelectUser(otherUser)}
                        >
                          {otherUser.latestMessage?.messageText || 'No messages'}
                          {otherUser.unreadCount > 0 && (
                            <span className="user-contact-unread">
                              {' '}
                              ({otherUser.unreadCount} unread)
                            </span>
                          )}
                          {' • '}
                          {/* Apply the new styles for the date */}
                          {otherUser.latestMessage?.createdAt && (
                            <span className="user-contact-date">
                              {new Date(otherUser.latestMessage.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 cursor-pointer"
                aria-hidden="true"
                onClick={() => handleSelectUser(otherUser)}
              />
            </div>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <ChatWindow
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserContact;