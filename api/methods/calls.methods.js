import { Meteor } from 'meteor/meteor';
import { Calls } from '../collections/calls.collection';
import { check } from 'meteor/check';

Meteor.methods({
  'calls.start'({ channelName, type }) {
    check(channelName, String);
    check(type, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const callId = Calls.insert({
      channelName,
      type,
      participants: [this.userId],
      startedAt: new Date(),
      createdBy: this.userId,
    });

    return callId;
  },

  'calls.end'({ callId }) {
    check(callId, String);

    const call = Calls.findOne(callId);

    if (!this.userId || call.createdBy !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Calls.update(callId, {
      $set: {
        active: false,
        endedAt: new Date(),
      },
      $pull: {
        participants: this.userId,
      },
    });
  },

  // Add other methods like 'agora.getToken' with proper checks and error handling
});
