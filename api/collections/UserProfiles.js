import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const UsersCollection = Meteor.users;

const BehaviorSchema = new SimpleSchema({
  behavior: {
    type: String,
    allowedValues: ['introverted', 'extroverted', 'ambivert'],
    optional: true,
  },
});

const DisabilitySchema = new SimpleSchema({
  hasDisability: {
    type: Boolean,
    defaultValue: false,
  },
  disabilityDescription: {
    type: String,
    optional: true,
  },
  // Add more specific disability-related fields as needed
  // For example: isBlind, isDeaf, isCrippled, etc.
});

const UserProfileSchema = new SimpleSchema({
  _id: String,
  authorId: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
  disability: {
    type: DisabilitySchema,
  },
  behavior: BehaviorSchema,
  profileCreatedAt: {
    type: Date,
    autoValue () {
      if (this.isInsert) {
        return new Date();
      }
      if (this.isUpdate) {
        this.unset(); // Prevent user from updating this field
      }
      if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
    },
  },
  agreedToTerms: {
    type: Boolean,
    defaultValue: false,
  },
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  birthDate: {
    type: String,
    optional: true, // Assuming date is stored as an ISO string
  },
  bodyHeight: {
    type: String,
    optional: true, // Stored as a string to match form data
  },
  biologicalGender: {
    type: String,
    allowedValues: ['male', 'female', 'other'],
    optional: true,
  },
  personalBio: {
    type: String,
    optional: true,
  },
  lookingForGender: {
    type: String,
    allowedValues: ['male', 'female', 'other'],
    optional: true,
  },
  lookingForBodyHeight: {
    type: String,
    allowedValues: ['short', 'tall', 'medium', 'any'],
    optional: true,
  },
  lookingForBodyType: {
    type: String,
    allowedValues: ['slim', 'thick', 'chubby', 'any'],
    optional: true,
  },
  agePreferenceMin: {
    type: Number,
    optional: true,
  },
  agePreferenceMax: {
    type: Number,
    optional: true,
  },
  country: {
    type: String,
    optional: true,
  },
  city: {
    type: String,
    optional: true,
  },
  interests: {
    type: Array,
    optional: true,
  },
  'interests.$': {
    type: Object,
  },
  'interests.$.interestName': {
    type: String,
  },
  relationshipPreferences: {
    type: String,
    allowedValues: ['marriage', 'friendship', 'other'],
    defaultValue: 'marriage',
    optional: true,
  },
  compatibility: {
    type: Object,
    defaultValue: {},
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  'profile.images': {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'profile.images.$': {
    type: Object,
    blackbox: true,
  },
  likedByUsers: {
    type: Array,
    defaultValue: [],
  },
  'likedByUsers.$': String,
  matches: {
    type: Array,
    defaultValue: [],
  },
  'matches.$': String,
});

export const UserProfiles = new Mongo.Collection('userProfiles');
UserProfiles.attachSchema(UserProfileSchema);

// Ensure index for UsersCollection
Meteor.startup(() => {
  if (Meteor.isServer) {
    UsersCollection._ensureIndex({ username: 1 }, { unique: true });
  }
});
