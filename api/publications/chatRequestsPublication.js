// /imports/api/publications/chatRequestsPublications.js

import { Meteor } from 'meteor/meteor';
import { ChatRequestsCollection } from '../collections/ChatRequestsCollection';


// /server/publications/chatRequestsPublications.js
Meteor.publish('chatRequests.toUser', function publishChatRequests() {
    if (!this.userId) {
      return this.ready();
    }
    return ChatRequestsCollection.find({ toUserId: this.userId, status: 'pending' });
  });
  
// Meteor.publish('chatRequests.toUser', function publishChatRequests() {
//     console.log("Publishing chat requests to user:", this.userId);
//     if (!this.userId) {
//       console.log("User not logged in, stopping publication.");
//       return this.ready();
//     }
  
//     const requests = ChatRequestsCollection.find({ toUserId: this.userId });
//     console.log("Found chat requests for user:", requests.fetch());
//     return requests;
//   });
  