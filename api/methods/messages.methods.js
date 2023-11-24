import { Meteor } from 'meteor/meteor';
import { Messages } from '../collections/messages.collection';
import { Conversations } from '../collections/Conversations';


// Ensure index on participants for faster querying
Conversations._ensureIndex({ participants: 1 });

function generateConversationId() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

Meteor.methods({
  'messages.insert'(conversationId, text) {
    check(conversationId, String);
    check(text, String);

    // Additional validation to check if the user is part of the conversation
    const conversation = Conversations.findOne({ _id: conversationId, participants: this.userId });
    if (!conversation) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to send messages in this conversation.');
    }

    // Additional validation to ensure message text length, etc.
    if (text.length === 0) {
      throw new Meteor.Error('invalid-message', 'You cannot send an empty message.');
    }

    try {
      // Insert message logic here
      const messageId = Messages.insert({
        conversationId,
        text,
        createdAt: new Date(),
        senderId: this.userId,
        // ... other necessary fields
      });
      return messageId;
    } catch (error) {
      // Log the error server-side and throw a sanitized error to the client
      console.error('Insert message error:', error);
      throw new Meteor.Error('insert-failed', 'Failed to insert message');
    }
  },
  getOrCreateConversation({ userId, otherUserId }) {
    check(userId, String);
    check(otherUserId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
    }

    if (this.userId !== userId) {
      throw new Meteor.Error('not-authorized', 'You cannot create a conversation with another user.');
    }

    // Check if there's an existing conversation between the two users
    let conversation = Conversations.findOne({
      participants: { $all: [userId, otherUserId] }
    });

    if (!conversation) {
      // If not, create a new conversation
      const conversationId = Conversations.insert({
        participants: [userId, otherUserId],
        createdAt: new Date(),
        lastMessage: '',
        lastMessageAt: null,
      });
      conversation = Conversations.findOne(conversationId);
    }

    // Fetch messages for the conversation
    const messages = Messages.find({ conversationId: conversation._id }, {
      sort: { createdAt: -1 },
      limit: 50, // or any other limit you deem appropriate
    }).fetch();

    // Return the conversation ID and messages
    return {
      conversationId: conversation._id,
      messages,
    };
  },
  // ...other Meteor methods
});