// @ts-nocheck
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const LearningsCollection = new Mongo.Collection('learnings');

const LearningsSchema = new SimpleSchema({
  video: {
    type: String,
  },
  image: {
    type: String,
  },
  author: {
    type: String,
  },

  title: {
    type: String,
  },
  date: {
    type: String,
  },

  category: {
    type: String,
  },

  description: {
    type: String,
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
});

LearningsCollection.attachSchema(LearningsSchema);
