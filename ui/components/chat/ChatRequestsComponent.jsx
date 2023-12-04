import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ChatRequestsCollection } from '../../../api/collections/ChatRequestsCollection';
import ChatRequestItem from './ChatRequestItem';

const ChatRequestsComponent = () => {
  const requests = useTracker(() => {
    Meteor.subscribe('chatRequests.toUser');
    return ChatRequestsCollection.find({ toUserId: Meteor.userId(), status: 'pending' }).fetch();
  }, []);

  if (requests.length === 0) {
    return <p>No chat requests.</p>;
  }

  return (
    <div>
      <h2>Chat Requests</h2>
      {requests.map(request => (
        <ChatRequestItem key={request._id} request={request} />
      ))}
    </div>
  );
};

export default ChatRequestsComponent;
