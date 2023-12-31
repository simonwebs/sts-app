import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const FriendRequestsCollection = new Mongo.Collection('friendRequests');

const FriendRequestSchema = new SimpleSchema({
  fromUserId: String,
  toUserId: String,
  status: {
    type: String,
    allowedValues: ['pending', 'accepted', 'rejected', 'cancelled'],
    defaultValue: 'pending'
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) return new Date();
    }
  }
});

FriendRequestsCollection.attachSchema(FriendRequestSchema);
