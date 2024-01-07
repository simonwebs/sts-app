// methods.js (server-side)

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SettingsCollection } from '../collections/SettingsCollection';

Meteor.methods({
  updateUserSettings (settings) {
    // Ensure the user is logged in before updating settings
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to perform this action.');
    }

    // Validate the settings object
    check(settings, Object);

    // Update user settings in MongoDB
    SettingsCollection.upsert({ userId: this.userId }, { $set: settings });

    return 'Settings updated successfully.';
  },

  toggleNotifications () {
    // Ensure the user is logged in before toggling notifications
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to perform this action.');
    }

    // Find the user's settings
    const userSettings = SettingsCollection.findOne({ userId: this.userId });
    if (!userSettings) {
      throw new Meteor.Error('settings-not-found', 'User settings not found.');
    }

    // Toggle the notifications status
    const newStatus = !userSettings.notifications;
    SettingsCollection.update({ userId: this.userId }, { $set: { notifications: newStatus } });

    return 'Notifications status updated successfully.';
  },

  updateUsername (newUsername) {
    // Ensure the user is logged in before updating the username
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to perform this action.');
    }

    // Validate newUsername
    check(newUsername, String);
    if (!newUsername.trim()) {
      throw new Meteor.Error(400, 'Username is required.');
    }

    // Update the username in the Meteor.users collection
    Meteor.users.update(this.userId, { $set: { username: newUsername } });

    return 'Username updated successfully.';
  },

  deleteAccount () {
    // Ensure the user is logged in before deleting the account
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to perform this action.');
    }

    // Additional logic for deleting associated data if needed...

    // Remove the user's settings from the database
    SettingsCollection.remove({ userId: this.userId });

    // Remove the user's account
    Meteor.users.remove(this.userId);

    return 'Account deleted successfully.';
  },
});
