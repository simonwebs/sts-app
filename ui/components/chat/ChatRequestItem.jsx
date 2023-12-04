import React from 'react';
import { Meteor } from 'meteor/meteor';

const ChatRequestItem = ({ request }) => {
  const handleAccept = () => {
    Meteor.call('chatRequests.accept', request._id, (error) => {
      if (error) {
        console.error('Error accepting request:', error);
      } else {
        console.log('Request accepted.');
      }
    });
  };

  const handleReject = () => {
    Meteor.call('chatRequests.reject', request._id, (error) => {
      if (error) {
        console.error('Error rejecting request:', error);
      } else {
        console.log('Request rejected.');
      }
    });
  };

  return (
    <div className="chat-request-item">
      <p>Request from: {request.fromUserId}</p> {/* Replace with user's name if available */}
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
};

export default ChatRequestItem;
