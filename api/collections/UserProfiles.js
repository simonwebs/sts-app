import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UserProfilePhotoSchema = new SimpleSchema({
  photoUrl: String,
  isProfilePhoto: {
    type: Boolean,
    defaultValue: false,
  },
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
    // denyUpdate is not needed because autoValue handles it
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
    allowedValues: ['male', 'female', 'other', 'any'],
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
  profilePhotos: {
    type: Array,
    defaultValue: [],
  },
  'profilePhotos.$': {
    type: UserProfilePhotoSchema,
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
