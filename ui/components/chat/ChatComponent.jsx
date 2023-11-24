import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const ChatComponent = ({ messages, conversationId }) => {
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return; // Prevent sending empty messages
  
    // Ensure conversationId is valid
    if (typeof conversationId !== 'string' || !conversationId) {
      console.error('Invalid conversationId:', conversationId);
      return;
    }
  
    // Insert message into the conversation
    Meteor.call('messages.insert', conversationId, trimmedMessage, (error) => {
      if (error) {
        console.error('Error inserting message:', error);
      } else {
        setMessage(''); // Clear input field after sending message
      }
    });
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <button onClick={toggleModal} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Open Chat
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Chat</h3>
              <button onClick={toggleModal} className="text-lg">&times;</button>
            </div>

            <div className="overflow-auto p-4 max-h-80">
              {messages.map((msg, index) => (
                <div key={index} className={`p-2 ${msg.senderId === Meteor.userId() ? 'text-right' : ''}`}>
                  <span className={`inline-block ${msg.senderId === Meteor.userId() ? 'bg-blue-500' : 'bg-gray-200'} rounded-lg px-4 py-2 shadow text-gray-800`}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex space-x-4 mt-4">
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
      )}
    </>
  );
};

export default ChatComponent;
