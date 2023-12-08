import { Meteor } from 'meteor/meteor';
import { UserProfiles, Messages } from '../collections/UserProfiles';

// Assuming Meteor.publish is used for publications
Meteor.publish('matchedUserProfiles', function (searchQuery) {
  return UserProfiles.find({
    $or: [
      { firstName: { $regex: searchQuery, $options: 'i' } },
      { lastName: { $regex: searchQuery, $options: 'i' } },
      // Add additional fields for matching here based on your schema
    ],
  });
});

Meteor.publish('userProfiles.all', function () {
  if (!this.userId) {
    return this.ready();
  }

  return UserProfiles.find({}, {
    fields: {
      authorId: 1,
      profileCreatedAt: 1,
      firstName: 1,
      lastName: 1,
      birthDate: 1,
      bodyHeight: 1,
      biologicalGender: 1,
      personalBio: 1,
      lookingForGender: 1,
      lookingForBodyHeight: 1,
      lookingForBodyType: 1,
      agePreferenceMin: 1,
      agePreferenceMax: 1,
      country: 1,
      city: 1,
      profilePhotos: 1,
      likedByUsers: 1,
      matches: 1,
    },
  });
});

Meteor.publish('userMessages', function (otherUserId) {
  if (!this.userId) {
    // If the user is not logged in, don't publish any data
    return this.ready();
  }

  // Publish messages between the logged-in user and another user
  return Messages.find({
    $or: [
      { senderId: this.userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: this.userId },
    ],
  });
});
