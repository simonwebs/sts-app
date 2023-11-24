import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Define a regular expression for MongoDB ObjectId
const regExId = /^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17}$/;

export const Messages = new Mongo.Collection('messages');

const MessageSchema = new SimpleSchema({
  conversationId: {
    type: String,
    regEx: regExId,
  },
  senderId: {
    type: String,
    regEx: regExId,
  },
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue() {  // autoValue is used for fields that are set automatically
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from setting their own value for this field
      }
    },
  },
  readBy: {
    type: Array,
    defaultValue: [],
  },
  'readBy.$': {
    type: String,
    regEx: regExId,
  },
  // Additional fields like attachments, editedAt, etc., can be added here
});

Messages.attachSchema(MessageSchema);
