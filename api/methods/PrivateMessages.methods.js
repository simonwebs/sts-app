// Server-side publications and methods

import { Meteor } from 'meteor/meteor';
import { PrivateMessages } from '../collections/privateMessages.collection';

Meteor.methods({
  'privateMessages.send'(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in.');
    }
  
    // Validate that the sender is the logged-in user
    if (message.senderId !== this.userId) {
      throw new Meteor.Error('invalid-sender', 'Invalid sender.');
    }
  
    // Check if the receiver exists
    if (!Meteor.users.findOne({ _id: message.receiverId })) {
      throw new Meteor.Error('receiver-not-found', 'Receiver not found.');
    }
  
    // Insert the message into the PrivateMessages collection
    PrivateMessages.insert({
      senderId: message.senderId,
      receiverId: message.receiverId,
      messageText: message.messageText, // Change the field name here
      timestamp: new Date(),
      // Add any other fields as needed
    });
  },
 
  'privateMessages.delete'(messageId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in.');
    }

    const message = PrivateMessages.findOne({ _id: messageId });

    if (!message) {
      throw new Meteor.Error('message-not-found', 'Message not found.');
    }

    // Check if the user is the sender of the message
    if (message.senderId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to delete this message.');
    }

    // Delete the message
    PrivateMessages.remove({ _id: messageId });
  },
  'privateMessages.reply'(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not logged in.');
    }

    // Validate that the sender is the logged-in user
    if (message.senderId !== this.userId) {
      throw new Meteor.Error('invalid-sender', 'Invalid sender.');
    }

    // Check if the original message exists
    const originalMessage = PrivateMessages.findOne({ _id: message.originalMessageId });

    if (!originalMessage) {
      throw new Meteor.Error('original-message-not-found', 'Original message not found.');
    }

    // Insert the reply message into the PrivateMessages collection
    const replyMessageId = PrivateMessages.insert(message);

    // Update the original message to include the reply
    PrivateMessages.update({ _id: message.originalMessageId }, {
      $push: { replies: replyMessageId },
    });

    return replyMessageId;
  },
});
