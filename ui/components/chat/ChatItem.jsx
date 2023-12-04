import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image } from 'cloudinary-react';

// Function to get user by ID
const getUserById = (userId) => Meteor.users.findOne(userId);

const ChatItem = ({ message, senderId, loggedUserId }) => {
  // Check if the message is sent by the logged-in user
  const isSentByLoggedUser = loggedUserId === senderId;

  // Get the sender information
  const sender = getUserById(senderId);

  // Check if sender exists and has a profile with an image
  const senderProfileImageId = sender?.profile?.image || 'https://via.placeholder.com/150';

  // Cloudinary configuration
  const cloudName = 'swed-dev';

  return (
    <div className={`flex items-center mb-4 ${isSentByLoggedUser ? 'justify-end' : 'justify-start'}`}>
      {/* Display sender's profile image if not sent by the logged user */}
      {!isSentByLoggedUser && (
        <Image
          cloudName={cloudName}
          publicId={senderProfileImageId}
          width="auto"
          crop="scale"
          quality="auto"
          fetchFormat="auto"
          secure
          dpr="auto"
          responsive
          className={`w-12 h-12 md:w-7 md:h-7 rounded-full mr-4 m-2 ${isSentByLoggedUser ? 'ml-auto' : ''}`}
          alt={sender?.username || 'Sender'}
        />
      )}
      {/* Display the message container */}
      <div className={`rounded-lg px-4 py-2 min-h-10 ${isSentByLoggedUser ? 'bg-primary text-white' : 'bg-gray-200 text-black'} relative`}>
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
      {/* Display sender's profile image if sent by the logged user */}
      {isSentByLoggedUser && (
        <Image
          cloudName={cloudName}
          publicId={senderProfileImageId}
          width="auto"
          crop="scale"
          quality="auto"
          fetchFormat="auto"
          secure
          dpr="auto"
          responsive
          className={`w-12 h-12 md:w-7 md:h-7 rounded-full mr-4 m-2 ${isSentByLoggedUser ? 'ml-auto' : ''}`}
          alt={sender?.username || 'Sender'}
        />
      )}
    </div>
  );
};

export default ChatItem;
