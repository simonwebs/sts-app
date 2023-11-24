import { Meteor } from 'meteor/meteor';
import { Messages } from '../collections/messages.collection';


Meteor.publish('messages.inConversation', function (conversationId) {
    check(conversationId, String);
  
    if (!this.userId) {
      return this.ready();
    }
  
    // Further checks should be added to ensure the user is part of the conversation
  
    return Messages.find({ conversationId }, {
      fields: Messages.publicFields,
      sort: { createdAt: -1 },
      limit: 50, // Implement pagination for larger conversations
    });
  });
  
  // Public fields to be published
  Messages.publicFields = {
    conversationId: 1,
    senderId: 1,
    text: 1,
    createdAt: 1,
    readBy: 1,
  };