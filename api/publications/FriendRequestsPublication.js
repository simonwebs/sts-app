import { Meteor } from 'meteor/meteor';
import { FriendRequestsCollection } from '../collections/FriendRequestsCollection';

Meteor.publish('friendRequestsData', function () {
  return FriendRequestsCollection.find({ recipientId: this.userId });
});
