import { Meteor } from 'meteor/meteor';
import { UserProfiles } from '../collections/UserProfiles';
import { PrivateMessages } from '../collections/privateMessages.collection';

Meteor.publish('matchedUserProfiles', function (searchQuery) {
  if (!this.userId) {
    return this.ready();
  }

  return UserProfiles.find({
    $and: [
      { _id: { $ne: this.userId } }, // Exclude the current user from the search
      {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          // Add additional fields for matching here based on your schema
        ],
      },
    ],
  });
});
Meteor.publish('userProfiles', function () {
  if (!this.userId) {
    return this.ready();
  }

  return UserProfiles.find({ authorId: this.userId });
});

Meteor.publish('userProfiles.all', function () {
  if (!this.userId) {
    return this.ready();
  }

  const userProfilesCursor = UserProfiles.find({}, {
    fields: {
      authorId: 1,
      profileCreatedAt: 1,
      disability: 1,
      disabilityDescription: 1,
      behavior: 1,
      relationshipPreferences: 1,
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
      status: 1,
      likedByUsers: 1,
      matches: 1,
      compatibility: 1,
    },
  });

  const usersCursor = Meteor.users.find({}, {
    fields: {
      'profile.images': 1,
    },
  });

  const handle = userProfilesCursor.observeChanges({
    added: (id, fields) => {
      console.log('Added to userProfilesCursor:', id, fields);
      this.added('userProfiles', id, fields);
    },
    changed: (id, fields) => {
      console.log('Changed in userProfilesCursor:', id, fields);
      this.changed('userProfiles', id, fields);
    },
    removed: (id) => {
      console.log('Removed from userProfilesCursor:', id);
      this.removed('userProfiles', id);
    },
  });

  const userHandle = usersCursor.observeChanges({
    added: (id, fields) => {
      console.log('Added to usersCursor:', id, fields);
      this.added('userProfiles', id, { profile: { images: fields['profile.images'] } });
    },
    changed: (id, fields) => {
      console.log('Changed in usersCursor:', id, fields);
      this.changed('userProfiles', id, { profile: { images: fields['profile.images'] } });
    },
    removed: (id) => {
      console.log('Removed from usersCursor:', id);
      this.removed('userProfiles', id);
    },
  });

  this.ready();

  this.onStop(() => {
    handle.stop();
    userHandle.stop();
  });
});

Meteor.publish('userMessages', function (otherUserId) {
  if (!this.userId) {
    return this.ready();
  }

  return PrivateMessages.find({
    $or: [
      { senderId: this.userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: this.userId },
    ],
  });
});
