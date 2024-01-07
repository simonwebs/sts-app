// imports/api/photos/photos.js
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Photos = new Mongo.Collection('photos');

const PhotoSchema = new SimpleSchema({
  userId: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  isProfilePhoto: {
    type: Boolean,
    defaultValue: false,
  },
});

Photos.attachSchema(PhotoSchema);
