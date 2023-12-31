import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Messages = new Mongo.Collection('messages');

const MessageSchema = new SimpleSchema({
  senderId: {
    type: String,
  },
  receiverId: {
    type: String,
  },
  readBy: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'readBy.$': {
    type: String,
  },
  message: {
    type: String,
    max: 2000,
  },
  timestamp: {
    type: Date,
  },
  deletedBy: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'deletedBy.$': {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert && !this.isSet) {
        return new Date();
      }
    },
  },
});

Messages.attachSchema(MessageSchema);
