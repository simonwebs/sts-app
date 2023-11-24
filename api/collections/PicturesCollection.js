import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PicturesCollection = new Mongo.Collection('pictures');

const PicturesSchema = new SimpleSchema({
  _id: String,
  authorId: String,
  title: String,
  createdAt: Date,
  image: {
    type: String,
    optional: true,
  },
  pictureImage: {
    type: String,
    optional: true,
  },
  userId: String,
  loves: {
    type: Array,
    defaultValue: [],
  },
  'loves.$': {
    type: String,
  },
});

PicturesCollection.attachSchema(PicturesSchema);
