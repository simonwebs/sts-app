// /imports/api/methods/chatRequestsMethods.js

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ChatRequestsCollection } from '../collections/ChatRequestsCollection';

Meteor.methods({
  'chatRequests.send'(toUserId) {
    check(toUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    return ChatRequestsCollection.insert({
      fromUserId: this.userId,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
    });
  },
  'chatRequests.cancel'(requestId) {
    check(requestId, String);
    const request = ChatRequestsCollection.findOne({ _id: requestId, fromUserId: this.userId });
    if (!request) {
      throw new Meteor.Error('Request not found or not authorized to cancel.');
    }
    return ChatRequestsCollection.update(requestId, { $set: { status: 'cancelled' } });
  },
  'chatRequests.accept'(requestId) {
    console.log("Accepting chat request:", requestId, "by user:", this.userId);
    check(requestId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const result = ChatRequestsCollection.update(
      { _id: requestId, toUserId: this.userId },
      { $set: { status: 'accepted' } }
    );

    console.log("Chat request accepted, update result:", result);
  },

  'chatRequests.reject'(requestId) {
    console.log("Rejecting chat request:", requestId, "by user:", this.userId);
    check(requestId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const result = ChatRequestsCollection.update(
      { _id: requestId, toUserId: this.userId },
      { $set: { status: 'rejected' } }
    );

    console.log("Chat request rejected, update result:", result);
  },

  'chatRequests.getStatus'(userId) {
    console.log("Getting chat request status for user:", userId, "requested by:", this.userId);
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const request = ChatRequestsCollection.findOne({ fromUserId: this.userId, toUserId: userId });
    console.log("Chat request status:", request ? request.status : "No request found");

    return request ? request.status : null;
  },

  'userProfiles.getProfile'(userId) {
    console.log("Fetching profile for user:", userId);
    check(userId, String);

    const profile = UserProfiles.findOne({ authorId: userId });
    console.log("Profile fetched:", profile);

    return profile;
  },
});
