import { Meteor } from 'meteor/meteor';
import { Messages } from '../collections/UserProfiles';
import { UserProfiles } from '../collections/UserProfiles';

Meteor.publish('matchedUserProfiles', function () {
  if (!this.userId) {
    return this.ready();
  }
  
  const currentUserProfile = UserProfiles.findOne({ userId: this.userId });

  // Define a query that selects users based on the current user's preferences
  const query = {
    $and: [
      { userId: { $ne: this.userId } },
      { biologicalGender: { $in: currentUserProfile.lookingForGender } },
      { bodyHeight: { $in: currentUserProfile.lookingForBodyHeight } },
      { bodyType: { $in: currentUserProfile.lookingForBodyType } },
      { agePreferenceMin: { $in: currentUserProfile.agePreferenceMin } },
      { agePreferenceMax: { $in: currentUserProfile.agePreferenceMax } },
      // Add more criteria based on currentUserProfile's preferences
    ]
  };

  return UserProfiles.find(query);
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
    }
  });
});

// Meteor.publish('userProfileData', function (userId) {
//   check(userId, String);

//   // If not logged in, do not publish any data
//   if (!this.userId) {
//     return this.ready();
//   }

//   // If the logged-in user is requesting their own data
//   if (this.userId === userId) {
//     return UserProfiles.find({ authorId: this.userId });
//   } else {
//     // If someone else is requesting the data, only publish non-sensitive fields
//     return UserProfiles.find(
//       { authorId: userId },
//       {
//         fields: {
//           'firstName': 1,
//           'lastName': 1,
//           'birthDate': 1,
//           'bodyHeight': 1,
//           'biologicalGender': 1,
//           'personalBio': 1,
//           'lookingForGender': 1,
//           'lookingForBodyHeight': 1,
//           'lookingForBodyType': 1,
//           'agePreferenceMin': 1,
//           'agePreferenceMax': 1,
//           'country': 1,
//           'city': 1,
//           'profilePhotos': 1,
//           // Exclude sensitive fields like 'likedByUsers' and 'matches'
//         }
//       }
//     );
//   }
// });

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

// Meteor.publish('currentUserProfile', function () {
//   // check if a user is logged in
//   if (!this.userId) {
//     return this.ready();
//   }

//   return UserProfiles.find({ authorId: this.userId }, {
//     fields: {
//       // Specify the fields you want to publish here
//       firstName: 1,
//       lastName: 1,
//       birthDate: 1,
//       bodyHeight: 1,
//       biologicalGender: 1,
//       personalBio: 1,
//       lookingForGender: 1,
//       lookingForBodyHeight: 1,
//       lookingForBodyType: 1,
//       agePreferenceMin: 1,
//       agePreferenceMax: 1,
//       country: 1,
//       city: 1,
//       profilePhotos: 1,
//       // authorId: 1, // You may not need to publish the authorId since it's the same as this.userId
//       likedByUsers: 1,
//       matches: 1,
//     }
//   });
// });