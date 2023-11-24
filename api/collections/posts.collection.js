import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PostsCollection = new Mongo.Collection('posts');

const PostsSchema = new SimpleSchema({
  _id: String,
  authorId: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
   shareCount: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  viewCount: {
    type: Number,
    defaultValue: 0,
  },
  video: {
    type: String,
    optional: true,
  },
  category: {
    type: String,
    allowedValues: ['health', 'prophecy', 'social', 'gospel'],
    optional: false,
  },
  thumbnail: {
    type: String,
    optional: true,
  },
  postImage: {
    type: String,
    optional: true,
  },
  caption: {
    type: String,
    optional: true,
    custom: function () {
      const caption = this.value;
      const wordCount = caption.split(' ').filter(Boolean).length;
      if (wordCount > 150) {
        return 'captionTooLong';
      }
    },
  },

  description: {
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
  lovedBy: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'lovedBy.$': String,
  href: {
    type: String,
    optional: true,
  },
  link: {
    type: String,
    optional: true,
  },
  image: {
    type: String,
    optional: true,
  },
});

PostsCollection.attachSchema(PostsSchema);
