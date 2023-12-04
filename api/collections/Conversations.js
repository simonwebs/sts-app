import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

// Create the Conversations collection
export const Conversations = new Mongo.Collection('conversations');

// Define the schema for a Conversation
const ConversationsSchema = new SimpleSchema({
  _id: String,
  authorId: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
  participants: {
    type: Array,
    label: "Participants",
    // Define custom validation to ensure array contains unique user IDs
    custom() {
      if (new Set(this.value).size !== this.value.length) {
        return SimpleSchema.ErrorTypes.VALUE_NOT_UNIQUE;
      }
    },
  },
  'participants.$': {
    type: String,
    label: "Participant",
    custom() {
      if (!this.value || !Meteor.isObjectId(this.value)) {
        return 'notAllowed';
      }
    },
  },
  
  lastMessage: {
    type: String,
    label: "Last Message",
    optional: true,
    // Define custom validation for the last message, if necessary
  },
  lastMessageAt: {
    type: Date,
    label: "Last Message Date",
    optional: true,
    // Automatically set the last message date on update
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
}, { check }); // Pass check to schema options for tighter integration

// Attach the schema to the collection
Conversations.attachSchema(ConversationsSchema);
