import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Messages } from '../collections/messages.collection';

Meteor.methods({
  'messages.send': function (message) {
    check(message, {
      senderId: String,
      receiverId: String,
      message: String,
      timestamp: Date,
    });
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Messages.insert({
      ...message,
      timestamp: new Date(),
    });
  },
  'messages.like' (messageId) {
    check(messageId, String);
    Messages.update(messageId, {
      $inc: { likes: 1 },
    });
  },
  'messages.deleteMessage'(messageId) {
    check(messageId, String);

    const message = Messages.findOne(messageId);

    if (!message) {
      throw new Meteor.Error('Message not found.');
    }

    // Check that user is authorized to delete the message
    if (this.userId !== message.senderId) {
      throw new Meteor.Error('Not authorized.');
    }

    Messages.remove(messageId);
  },
  'messages.unsendMessage'(messageId) {
    check(messageId, String);

    const message = Messages.findOne(messageId);

    if (!message) {
      throw new Meteor.Error('Message not found.');
    }

    // Check that user is authorized to unsend the message
    if (this.userId !== message.senderId) {
      throw new Meteor.Error('Not authorized.');
    }

    // Instead of completely deleting the message, we update it to show that it's been unsent.
    Messages.update(messageId, {
      $set: { unsent: true, content: "This message has been unsent." },
    });
  },
 'messages.updateReadBy'(messageId, userId) {
    check(messageId, String);
    check(userId, String);

    // Ensure the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Ensure the user is the receiver of the message
    const message = Messages.findOne(messageId);
    if (message.receiverId !== userId) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.update(messageId, {
      $addToSet: { readBy: userId },
    });
  },
  'messages.delete': function (messageId) {
    check(messageId, String);

    // Again, the actual implementation will depend on your application
    const message = Messages.findOne(messageId);
    if (!message) {
      throw new Meteor.Error('404', 'Message not found');
    }

    // This will delete the message from the database
    Messages.remove(messageId);
  },

  'messages.forward': function (messageId) {
    check(messageId, String);

    const message = Messages.findOne(messageId);
    if (!message) {
      throw new Meteor.Error('404', 'Message not found');
    }

    // The actual forwarding functionality will depend on your application
    // For example, you might add the message to a different conversation:
    Messages.insert({
      ...message,
      conversationId: 'some-other-conversation-id',
    });
  },
  'messages.fetch' (senderId, receiverId) {
    // Check the arguments
    check(senderId, String);
    check(receiverId, String);
    const { userId } = this;
    if (!userId) {
      throw new Meteor.Error('Access denied');
    }
    // Fetch the messages
    return Messages.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }, { sort: { timestamp: 1 } }).fetch();
  },
});
