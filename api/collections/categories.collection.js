// @ts-nocheck
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CategoriesCollection = new Mongo.Collection('categories');

const CategoriesSchema = new SimpleSchema({
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
  },
});

CategoriesCollection.attachSchema(CategoriesSchema);
