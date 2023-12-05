import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { PrivateMessages } from '../../../api/collections/privateMessages.collection';
import ChatItem from './ChatItem';
import { Image } from 'cloudinary-react';
import { XCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatWindow = ({ className, selectedUser, onClose }) => {
  // State variables
  const [currentMessage, setCurrentMessage] = useState('');
  const { loggedUser } = useLoggedUser();
  const [messages, setMessages] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [showPaperIcon, setShowPaperIcon] = useState(false);

  // Function to handle sending a message
  const handleSend = async () => {
    if (!currentMessage || !selectedUser || !selectedUser._id) {
      console.error('Invalid input data for sending a message.');
      return;
    }

    const newMessage = {
      senderId: Meteor.userId(),
      receiverId: selectedUser._id,
      messageText: currentMessage,
      timestamp: new Date(),
    };

    try {
      Meteor.call('privateMessages.send', newMessage, (error) => {
        if (error) {
          console.error('Error sending the message:', error.reason);
        } else {
          console.log('Message sent successfully!');
        }
      });
    } catch (error) {
      console.error('Error sending the message:', error);
    }

    setCurrentMessage('');
  };

  // Function to handle input changes
  const handleInput = (e) => {
    setCurrentMessage(e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setShowPaperIcon(e.target.value !== '');
  };

  // Function to handle Enter key press for sending
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Check if the logged user is the same as the selected user
  const isCurrentUser = loggedUser && selectedUser && loggedUser._id === selectedUser._id;

  // useEffect to subscribe to and fetch messages
  useEffect(() => {
    let messagesSub;
    let computation;

    if (loggedUser && selectedUser) {
      const userIds = [loggedUser._id, selectedUser._id].sort();
      const [senderId, receiverId] = userIds;

      messagesSub = Meteor.subscribe('privateMessages', senderId, receiverId);

      computation = Tracker.autorun(() => {
        if (messagesSub.ready()) {
          const fetchedMessages = PrivateMessages.find(
            {
              $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            },
            { sort: { timestamp: 1 } }
          ).fetch();

          setMessages(fetchedMessages);
        }
      });
    }

    return () => {
      messagesSub && messagesSub.stop();
      computation && computation.stop();
    };
  }, [loggedUser, selectedUser]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50 ${className}`}>
      <div className="chat-modal bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Image
              cloudName="swed-dev"
              publicId={selectedUser?.profile?.image || 'https://via.placeholder.com/150'}
              width="auto"
              crop="scale"
              quality="auto"
              fetchFormat="auto"
              secure={true}
              dpr="auto"
              responsive={true}
              className="w-8 h-8 rounded-full mr-2"
              alt={`${selectedUser?.username || 'User'}'s profile`}
            />
          </div>

          <p className={`font-semibold text-sm md:text-md lg:text-lg ${isCurrentUser ? 'text-right' : ''}`}>
            {selectedUser ? `${selectedUser?.username || 'No username'}` : 'Select a user'}
          </p>
          <div className="flex justify-end">
            <button onClick={onClose}>
              <XCircleIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div className={`overflow-auto p-3 max-h-[300px]`} style={{ direction: 'ltr' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex items-center ${message.senderId === loggedUser._id ? 'justify-end' : 'justify-start'}`}
            >
              <ChatItem
                message={message.messageText}
                senderId={message.senderId}
                loggedUserId={loggedUser._id}
                loggedUser={loggedUser}
              />
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={`relative flex items-center transition-all duration-200 ease-in-out ${inputFocused ? 'w-3/4' : 'w-1/2'}`}
        >
          <textarea
            rows="1"
            value={currentMessage}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="w-full py-2 px-3 md:py-2 shadow-md md:px-3 lg:py-3 lg:px-4 rounded-2xl resize-none dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 bg-gray-100 border-transparent focus:ring-0 focus:border-transparent mb-1"
            placeholder="Type here..."
            style={{ overflow: 'hidden' }}
          />
          {showPaperIcon && (
            <button
              className="rounded-full bg-gray-300 p-1.5 text-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <PaperAirplaneIcon className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
