import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image } from 'cloudinary-react';

// Function to get user by ID
const getUserById = (userId) => Meteor.users.findOne(userId);

const ChatItem = ({ message, senderId, loggedUserId }) => {
  const isSentByLoggedUser = loggedUserId === senderId;
  const sender = getUserById(senderId);
  const senderProfileImageId = sender?.profile?.image || 'https://via.placeholder.com/150';
  const cloudName = 'techpulse';

  return (
    <div className={`flex items-center mb-4 ${isSentByLoggedUser ? 'justify-end' : 'justify-start'}`}>
      {!isSentByLoggedUser && (
        <div className="flex-shrink-0">
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
            className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-4"
            alt={sender?.username || 'Sender'}
          />
        </div>
      )}
      <div className={`rounded-lg px-4 py-2 min-h-10 ${isSentByLoggedUser ? 'bg-primary text-white' : 'bg-gray-200 text-black'} relative`}>
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
      {isSentByLoggedUser && (
        <div className="flex-shrink-0">
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
            className="w-6 h-6 md:w-8 md:h-8 rounded-full ml-2"
            alt={sender?.username || 'Sender'}
          />
        </div>
      )}
    </div>
  );
};

export default ChatItem;
