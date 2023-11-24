import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const ChatComponent = ({ messages, conversationId }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return; // Prevent sending empty messages
  
    // Double check that conversationId is a string and not empty
    if (typeof conversationId !== 'string' || !conversationId) {
      console.error('Invalid conversationId:', conversationId);
      return;
    }
  
    // Call the Meteor method to insert a new message
    Meteor.call('messages.insert', conversationId, trimmedMessage, (error, messageId) => {
      if (error) {
        console.error('Error inserting message:', error);
        // Here you might want to display the error to the user
      } else {
        // Optionally handle the new messageId, like updating the UI or clearing the message input
        setMessage('');
      }
    });
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="overflow-auto p-4 flex-grow">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.senderId === Meteor.userId() ? 'text-right' : ''}`}>
            <span className={`inline-block ${msg.senderId === Meteor.userId() ? 'bg-blue-500' : 'bg-gray-200'} rounded-lg px-4 py-2 shadow text-gray-800`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white shadow-up-md">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 border rounded focus:ring focus:ring-blue-300 transition ease-in-out duration-150"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded font-semibold focus:outline-none hover:bg-blue-600 transition ease-in-out duration-150"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
