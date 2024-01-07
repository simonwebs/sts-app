import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PrivateMessages = new Mongo.Collection('privateMessages');

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
  messageText: {
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
  likes: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'likes.$': {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue () {
      if (this.isInsert && !this.isSet) {
        return new Date();
      }
    },
  },
});

PrivateMessages.attachSchema(MessageSchema);
