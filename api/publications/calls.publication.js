import { Calls } from '../collections/calls.collection'
import { Meteor } from 'meteor/meteor';

// Publish calls that the user is a part of
Meteor.publish('calls.myCalls', function () {
    if (!this.userId) {
      return this.ready();
    }
  
    return Calls.find({
      participants: this.userId,
      active: true,
    }, {
      fields: Calls.publicFields,
    });
  });
  
  // Define public fields to be published
  Calls.publicFields = {
    channelName: 1,
    active: 1,
    participants: 1,
    type: 1,
    startedAt: 1,
    // Do not publish endedAt or recordings as they might contain sensitive information
  };