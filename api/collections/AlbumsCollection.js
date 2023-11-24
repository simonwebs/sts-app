import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const AlbumsCollection = new Mongo.Collection('albums');

const AlbumsSchema = new SimpleSchema({
  _id: String,
  authorId: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
  viewCount: {
    type: Number,
    defaultValue: 0,
  },
  albumImage: {
    type: String,
    optional: true,
  },
  caption: {
    type: String,
    optional: true,
  },
  loves: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'loves.$': {
    type: String,
  },
  image: {
    type: String,
    optional: true,
  },
});

AlbumsCollection.attachSchema(AlbumsSchema);
