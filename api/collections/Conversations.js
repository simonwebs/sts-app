import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

// Create the Conversations collection
export const Conversations = new Mongo.Collection('conversations');

// Define the schema for a Conversation
const ConversationsSchema = new SimpleSchema({
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
    // Use the check package to validate if the string is a valid Mongo ID
    custom() {
      if (!this.value || !check(this.value, String)) {
        return SimpleSchema.ErrorTypes.VALUE_NOT_ALLOWED;
      }
    },
  },
  createdAt: {
    type: Date,
    label: "Creation Date",
    // Automatically set the creation date on insert
    autoValue() {
      if (this.isInsert) {
        return new Date();
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
