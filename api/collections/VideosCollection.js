import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const VideosCollection = new Mongo.Collection('videos');

const VideosSchema = new SimpleSchema({
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
  url: String,
  category: {
    type: String,
    allowedValues: ['health', 'prophecy', 'social', 'gospel'],
  },
  platform: {
    type: String,
    allowedValues: ['youtube', 'instagram', 'tiktok'],
  },
  title: String,
  content: {
    type: String,
    optional: true,
  },
  loves: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'loves.$': String,
  lovedBy: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'lovedBy.$': String,
});

VideosCollection.attachSchema(VideosSchema);
