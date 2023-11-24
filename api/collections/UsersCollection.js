// @ts-nocheck
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

export const UsersCollection = Meteor.users;

UsersCollection.attachSchema(new SimpleSchema({
  username: {
  type: String,
  min: 3,
  max: 20,
  optional: true, 
  custom() {
    if (Meteor.isServer && this.isInsert && this.value) {
      const username = this.value;
      const userExists = UsersCollection.findOne({ username, _id: { $ne: this.docId } });

      if (userExists) {
        return SimpleSchema.ErrorTypes.VALUE_NOT_UNIQUE;
      }
    }
  },
},
  _id: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true, // Use blackbox if you don't want to specify all nested fields
  },
  'profile.image': {
    type: String,
    optional: true,
  },
  newImage: {
    type: String,
    optional: true,
  },
  emails: {
    type: Array,
    optional: true,
  },
  'emails.$': {
    type: Object,
    optional: true,
  },
  'emails.$.address': {
    type: String,
    regEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  friendRequests: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'friendRequests.$': {
    type: String,
  },
  sentRequests: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'sentRequests.$': {
    type: String,
  },
  friends: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'friends.$': {
    type: String,
  },
  status: {
    type: Object,
    optional: true,
    blackbox: true, // Use blackbox for the status field as well
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
}));

Meteor.startup(() => {
  if (Meteor.isServer) {
    UsersCollection._ensureIndex({ username: 1 }, { unique: true });
  }
});
