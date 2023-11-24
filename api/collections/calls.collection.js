import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Custom regular expression to match a MongoDB ObjectId
const objectIdPattern = /^[a-f\d]{24}$/i;
const urlRegEx = /^https?:\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,3}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/\S*)?$/i;

const CallSchema = new SimpleSchema({
  channelName: {
    type: String,
    regEx: objectIdPattern,
  },
  active: {
    type: Boolean,
    defaultValue: true,
  },
  participants: {
    type: Array,
  },
  'participants.$': {
    type: String,
    regEx: objectIdPattern,
  },
  type: {
    type: String,
    allowedValues: ['video', 'audio'], // Restrict to video or audio
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
    optional: true, // Only set when the call ends
  },
  createdBy: {
    type: String,
    regEx: objectIdPattern,
  },
  recordings: {
    type: Array,
    optional: true,
  },
  'recordings.$': {
    type: new SimpleSchema({
      url: {
        type: String,
        regEx: urlRegEx, // Use the custom URL regex
      },
      startedAt: {
        type: Date,
      },
      endedAt: {
        type: Date,
      },
      // Add more recording details as necessary
    }),
  },
});

export const Calls = new Mongo.Collection('calls');
Calls.attachSchema(CallSchema);
