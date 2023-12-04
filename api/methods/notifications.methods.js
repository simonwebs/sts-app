// imports/api/notifications.methods.js
import { Meteor } from 'meteor/meteor';
import { Notifications } from '../collections/notifications.collection';


Meteor.methods({
  'notifications.getNotificationCount'(userId) {
    return Notifications.find({ userId, read: false }).count();
  },

  'notifications.markAsRead'(userId) {
    Notifications.update({ userId, read: false }, { $set: { read: true } }, { multi: true });
  },
});