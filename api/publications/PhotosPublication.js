import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Photos } from '../collections/Photos';

Meteor.publish('userImages', function (userId) {
  check(userId, String);

  if (!this.userId) {
    // If the user is not logged in, do not publish anything
    return this.ready();
  }

  console.log('Publishing user images for userId:', userId);

  // Assuming you want to publish data from the Photos collection
  const cursor = Photos.find({ userId });

  // Return the cursor
  return cursor;
});
