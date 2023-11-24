// @ts-nocheck
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

export const HistoriesCollection = new Mongo.Collection('histories', { private: true });

const HistoriesSchema = new SimpleSchema({
  prompts: {
    type: Array,
    required: true,
  },
  'prompts.$': {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  generatedConversation: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt: {
    type: Date,
  },
});

HistoriesCollection.attachSchema(HistoriesSchema);
