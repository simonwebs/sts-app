// Server-side publication in /imports/api/publications.js or similar file
import { Meteor } from 'meteor/meteor';
import { FriendRequestsCollection } from '../collections/FriendRequestsCollection';

Meteor.publish('friendRequests.toUser', function () {
  if (!this.userId) {
    // If the user is not logged in, do not publish anything
    return this.ready();
  }

  // Publish all friend requests where the current user is the target
  return FriendRequestsCollection.find({ toUserId: this.userId });
});