import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ChatRequestsCollection = new Mongo.Collection('chatRequests');

const ChatRequestSchema = new SimpleSchema({
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

ChatRequestsCollection.attachSchema(ChatRequestSchema);
