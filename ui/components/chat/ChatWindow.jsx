import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { PrivateMessages } from '../../../api/collections/privateMessages.collection';
import ChatItem from './ChatItem';
import { Image } from 'cloudinary-react';
import { XCircleIcon, PaperAirplaneIcon, TrashIcon, ReplyIcon } from '@heroicons/react/24/outline';
import autoResize from 'autoresize';

const ChatWindow = ({ className, selectedUser, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const { loggedUser } = useLoggedUser();
  const [messages, setMessages] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      autoResize(textareaRef.current);
    }
  }, []);

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
      await new Promise((resolve, reject) => {
        Meteor.call('privateMessages.send', newMessage, (error) => {
          if (error) {
            console.error('Error sending the message:', error.reason);
            reject(error.reason);
          } else {
            console.log('Message sent successfully!');
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error sending the message:', error);
    }

    // Scroll to the latest message
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Maintain focus on the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    // Reset input size after sending the message
    setCurrentMessage('');
  };

  const handleInput = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const isCurrentUser = loggedUser && selectedUser && loggedUser._id === selectedUser._id;

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
            { sort: { timestamp: 1 } },
          ).fetch();

          setMessages(fetchedMessages);
          setMessageCount(fetchedMessages.length);
        }
      });
    }

    return () => {
      messagesSub && messagesSub.stop();
      computation && computation.stop();
    };
  }, [loggedUser, selectedUser]);

  const handleDelete = (messageId) => {
    // Handle deletion logic here
    console.log(`Deleting message with ID: ${messageId}`);
  };

  const handleReply = (messageId) => {
    // Handle reply logic here
    console.log(`Replying to message with ID: ${messageId}`);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50 ${className}`}>
      <div className="chat-modal bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Image
              cloudName="techpulse"
              publicId={selectedUser?.profile?.image || 'https://via.placeholder.com/150'}
              width="auto"
              crop="scale"
              quality="auto"
              fetchFormat="auto"
              secure
              dpr="auto"
              responsive
              className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2"
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

        <div
          id="chatContainer"
          className={`overflow-auto p-2 ${messageCount > 5 ? 'max-h-[200px]' : ''} min-h-[200px]`}
          style={{ direction: 'ltr' }}
        >
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
                onClick={() => setSelectedMessage(message._id)}
              />
              {selectedMessage === message._id && (
                <div className="flex space-x-2">
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => handleDelete(message._id)}
                  />
                  <ReplyIcon
                    className="h-5 w-5 text-blue-500 cursor-pointer"
                    onClick={() => handleReply(message._id)}
                  />
                </div>
              )}
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
            ref={textareaRef}
            id="chatTextarea"
            rows="1"
            value={currentMessage}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="w-full py-2 px-3 md:py-2 shadow-md md:px-3 lg:py-3 lg:px-4 rounded-2xl resize-none dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 bg-gray-100 border-transparent focus:ring-0 focus:border-transparent mb-1"
            placeholder="Type here..."
          />
          <button
            type="button"
            aria-label="Send Message"
            className="rounded-full bg-gray-300 p-1.5 text-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={handleSend}
          >
            <PaperAirplaneIcon className="h-5 w-5 text-gray-700" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
