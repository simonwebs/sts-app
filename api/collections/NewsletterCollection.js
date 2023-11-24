import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const NewsletterCollection = new Mongo.Collection('newsletter');

const NewsletterSchema = new SimpleSchema({
  email: {
    type: String,
  },
  archived: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt: {
    type: Date,
  },
});

NewsletterCollection.attachSchema(NewsletterSchema);
