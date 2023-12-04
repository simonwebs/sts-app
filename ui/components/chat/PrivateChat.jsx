import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PrivateMessages } from '../../../api/collections/privateMessages.collection';

const PrivateChat = ({ recipientUserId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const currentUser = Meteor.user();

  const { isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('privateMessages', recipientUserId);

    if (!subscription.ready()) {
      return { isLoading: true };
    }

    const fetchedMessages = PrivateMessages.find(
      {
        $or: [
          { senderId: currentUser._id, receiverId: recipientUserId },
          { senderId: recipientUserId, receiverId: currentUser._id },
        ],
      },
      { sort: { timestamp: 1 } }
    ).fetch();

    setMessages(fetchedMessages);

    return { isLoading: false };
  }, [recipientUserId]);

  const handleSendMessage =  async () => {
  
      if (!currentMessage) return;
    
      const senderId = loggedUser._id;
      const receiverId = selectedUser._id;
    
      // Calculate chatId by sorting and concatenating senderId and receiverId
      const chatId = [senderId, receiverId].sort().join('');
    
      const newMessage = {
        senderId,
        receiverId,
        message: currentMessage,
        timestamp: new Date(),
        chatId, // Include chatId in the message object
      };
    
      try {
        await new Promise((resolve, reject) => {
          Meteor.call('privateMessages.send', newMessage, (error) => {
            if (error) {
              console.error('Error sending private message:', error);
              reject(error);
            } else {
              console.log('Private message sent successfully');
              resolve();
            }
          });
        });
    
        setCurrentMessage('');
      } catch (error) {
        console.error('Error sending private message:', error);
      }
    };
    
  return (
    <div>
      <h2 className="text-lg font-semibold">Private Messages</h2>
      {isLoading ? (
        <div>Loading messages...</div>
      ) : (
        <div>
          <div className="mb-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-2 ${msg.senderId === currentUser._id ? 'text-right' : 'text-left'}`}
              >
                {msg.message}
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <textarea
              className="w-full p-2 border rounded-lg"
              rows="2"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChat;
