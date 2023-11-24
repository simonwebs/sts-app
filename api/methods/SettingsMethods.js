import { Meteor } from 'meteor/meteor';
import { SettingsCollection } from '../collections/SettingsCollection';

Meteor.methods({
  'updateUserSettings': function(settings) {
    // Update user settings in MongoDB
    SettingsCollection.upsert({ userId: this.userId }, { $set: settings });
  },
   'toggleNotifications': function() {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('Not authorized');
    }

    const userSettings = SettingsCollection.findOne({ userId });
    if (!userSettings) {
      throw new Meteor.Error('Settings not found');
    }

    const newStatus = !userSettings.notifications;
    SettingsCollection.update({ userId }, { $set: { notifications: newStatus } });
  },
   'updateUsername': function(newUsername) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('Not authorized');
    }

    // Validate newUsername
    if (!newUsername || newUsername.trim() === '') {
      throw new Meteor.Error(400, 'Username is required');
    }

    // Update the username in the SettingsCollection
    Meteor.users.update(this.userId, { $set: { 'username': newUsername } });
  },
});
