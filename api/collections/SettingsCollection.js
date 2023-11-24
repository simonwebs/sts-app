import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const SettingsCollection = new Mongo.Collection('settings');

const SettingsSchema = new SimpleSchema({
  userId: String,
  notifications: Boolean,
  theme: String,
  color: String,
  username: String,
  displayDataToPublic: Boolean,
  allowOthersToSeePost: Boolean,
  allowOthersToReact: Boolean,
});

SettingsCollection.attachSchema(SettingsSchema);
