import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CommentsCollection = new Mongo.Collection('comments');

const CommentSchema = new SimpleSchema({
  _id: String,
  postId: {
    type: String,
    optional: false,
  },
  authorId: {
    type: String,
    optional: false,
  },
  authorImage: {
    type: String,
    optional: true,
  },
  authorUsername: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) return new Date();
    },
  },
  parentId: {
    type: String,
    optional: true,
  },
  depth: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  ancestors: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'ancestors.$': {
    type: String,
  },
  content: {
    type: String,
    optional: false,
  },
  replies: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'replies.$': {
    type: Object,
  },
  'replies.$.userId': {
    type: String,
    optional: false,
  },
  'replies.$.text': {
    type: String,
    optional: false,
  },
  'replies.$.createdAt': {
    type: Date,
    optional: false,
    autoValue: function () {
      if (this.isInsert || this.isUpsert) return new Date();
    },
  },
  'replies.$.replyLikeCount': {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  'replies.$.replyLikedBy': {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'replies.$.replyLikedBy.$': {
    type: String,
  },
  likes: {
    type: Number,
    defaultValue: 0,
  },
  likeCount: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  replyCount: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  
  likedBy: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'likedBy.$': {
    type: String,
  },
});

CommentsCollection.attachSchema(CommentSchema);
