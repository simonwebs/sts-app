import { Meteor } from 'meteor/meteor';
import { SettingsCollection } from '../collections/SettingsCollection';

Meteor.publish('userSettings', function() {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  return SettingsCollection.find({ userId });
});
