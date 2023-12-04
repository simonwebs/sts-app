import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FriendRequestsCollection } from '../collections/FriendRequestsCollection';

Meteor.methods({
  'friendRequests.send'(toUserId) {
    check(toUserId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const existingRequest = FriendRequestsCollection.findOne({
      $or: [
        { fromUserId: this.userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: this.userId }
      ]
    });

    if (existingRequest) {
      throw new Meteor.Error('Request already sent or connected.');
    }

    return FriendRequestsCollection.insert({
      fromUserId: this.userId,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
    });
  },
  
  'friendRequests.cancel'(requestId) {
    check(requestId, String);
    const request = FriendRequestsCollection.findOne({ _id: requestId, fromUserId: this.userId });
    if (!request) {
      throw new Meteor.Error('Request not found or not authorized to cancel.');
    }
    return FriendRequestsCollection.update(requestId, { $set: { status: 'cancelled' } });
  },
  'friendRequests.accept'(requestId) {
    check(requestId, String);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    return FriendRequestsCollection.update(
      { _id: requestId, toUserId: this.userId },
      { $set: { status: 'accepted' } }
    );
  },
  'friendRequests.reject'(requestId) {
    check(requestId, String);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    return FriendRequestsCollection.update(
      { _id: requestId, toUserId: this.userId },
      { $set: { status: 'rejected' } }
    );
  },
  'friendRequests.getStatus'(userId) {
    check(userId, String);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    // Check for any request where either the current user sent it or received it
    const request = FriendRequestsCollection.findOne({
      $or: [
        { fromUserId: this.userId, toUserId: userId },
        { fromUserId: userId, toUserId: this.userId }
      ]
    });

    return request ? request.status : null;
  },
});
