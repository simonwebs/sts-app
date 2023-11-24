import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { PostsCollection } from '../collections/posts.collection';
import { UserProfiles } from '../collections/UserProfiles';
import { UsersCollection } from '../collections/UsersCollection';

Meteor.startup(() => {
  Accounts.onLogin((loginAttempt) => {
    if (loginAttempt.user) {
      UsersCollection.update(loginAttempt.user._id, {
        $set: {
          'status.online': true,
          'status.lastSeen': new Date(),
        },
      });
    }
  });

  Accounts.onLogout((logoutAttempt) => {
    if (logoutAttempt.user) {
      UsersCollection.update(logoutAttempt.user._id, {
        $set: {
          'status.online': false,
          'status.lastSeen': new Date(),
        },
      });
    }
  });
});

Meteor.onConnection((connection) => {
  connection.onClose(() => {
    if (connection.userId) {
      Meteor.users.update(connection.userId, {
        $set: {
          'status.online': false,
          'status.lastSeen': new Date(),
        },
      });
    }
  });

  if (connection.userId) {
    Meteor.users.update(connection.userId, {
      $set: {
        'status.online': true,
        'status.lastSeen': new Date(),
      },
    });
  }
});
Meteor.publish('allUsers', function (page = 0, pageSize = 5) {
  check(page, Number);
  check(pageSize, Number);

  const currentUser = Meteor.users.findOne(this.userId);
  let fields = {
      username: 1,
      'profile.image': 1,
      newImage: 1, // Added this line
      friendRequests: 1,
      friends: 1,
      status: 1,
      createdAt: 1,
      'profile.gender': 1,
      'profile.profession': 1,
      'profile.location': 1,
      'profile.maritalStatus': 1,
    };
  if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
    fields = { ...fields, 'adminField1': 1, 'adminField2': 1 };
  }

  return Meteor.users.find({}, {
    skip: page * pageSize,
    limit: pageSize,
    fields,
  });
});


// Server-side publication
Meteor.publish('users.getById', function (userId) {
  check(userId, String);
  return Meteor.users.find({ _id: userId }, {
    fields: {
      username: 1,
      authorId: 1,
      'profile.image': 1,
      'profile.bannerImage': 1,
      // ... other fields you need to publish
    },
  });
});

Meteor.publish('userStatus', function () {
  return Meteor.users.find({ 'status.online': true }, {
    fields: {
      username: 1,
      createdAt: 1,
      authorId: 1,
      'profile.image': 1, // Updated this line
      status: 1,
    },
  });
});

// Server-side publication in /server/publications.js
Meteor.publish('userProfileData', function (userId) {
  // Allow the userId to be null and handle it gracefully
  if (userId && typeof userId === 'string') {
    if (this.userId === userId) {
      // Logged-in user requesting their own profile
      return UserProfiles.find({ userId: userId });
    } else {
      // Any logged-in user requesting someone else's profile
      return UserProfiles.find({ userId: userId }, {
        fields: {
          // List the fields you want to be publicly available to other users
          'firstName': 1,
          'lastName': 1,
          'birthDate': 1,
          'bodyHeight': 1,
          'biologicalGender': 1,
          'personalBio': 1,
          'lookingForGender': 1,
          'agePreferenceMin': 1,
          'agePreferenceMax': 1,
          'country': 1,
          'city': 1,
          'profilePhotos': 1
        }
      });
    }
  } else {
    // If no valid userId is provided, don't send any data
    return this.ready();
  }
});

// Server-side Meteor publication
// Meteor.publish('userDataWithProfile', function (userId) {
//   check(userId, String);

//   if (!this.userId) {
//     // Handle the case where the user is not logged in
//     return this.ready();
//   }

//   const user = Meteor.users.find({ _id: userId }, {
//     fields: {
//       username: 1,
//       status: 1,
//       'profile.image': 1,
//       'profile.bannerImage': 1,
//     }
//   });

//   const userProfile = UserProfiles.find({ authorId: userId });

//   // Only send the data when both cursors are ready
//   if (user.cursor && userProfile.cursor) {
//     return [user, userProfile];
//   } else {
//     // Handle the loading state on the client
//     return this.ready();
//   }
// });


// Server-side publication
// Meteor.publish('userDataWithProfile', function (userId) {
//   check(userId, String);
//   if (!this.userId) {
//     return this.ready();
//   }
//   if (this.userId !== userId && !Roles.userIsInRole(this.userId, ['admin'])) {
//     // Optionally check if the user has the right to access the data
//     return this.ready();
//   }
//   const user = Meteor.users.find({ _id: userId }, {
//      fields: {
//       username: 1,
//       status: 1,
//       'profile.image': 1,
//       'profile.bannerImage': 1,
//      } });
//   const userProfile = UserProfiles.find({ userId: userId },
//      { 
//       fields: { 
//         'firstName': 1,
//         'lastName': 1,
//         'birthDate': 1,
//         'bodyHeight': 1,
//         'biologicalGender': 1,
//         'personalBio': 1,
//         'lookingForGender': 1,
//         'agePreferenceMin': 1,
//         'agePreferenceMax': 1,
//         'country': 1,
//         'city': 1,
//         'profilePhotos': 1
//         } });
//   if (!user || !userProfile) {
//     return this.ready();
//   }
//   return [user, userProfile];
// });

Meteor.publish('profileData', function (userId) {
  check(userId, String);

  if (!this.userId || this.userId !== userId) {
    // Optional: Depending on your app's privacy requirements, you might not want to throw an error here.
    return this.ready();
  }

  return Meteor.users.find({ _id: userId }, {
    fields: {
      username: 1,
      'profile.image': 1,
      'profile.bannerImage': 1,
      // ...any other fields you need
    },
  });
});

Meteor.publish('friends', function () {
  if (this.userId) {
    const currentUser = Meteor.users.findOne(this.userId);
    const friendsIds = currentUser.friends || [];
    return Meteor.users.find({ _id: { $in: friendsIds } },
      {
        fields: {
          username: 1,
          status: 1,
          createdAt: 1,
          'profile.image': 1, // Updated this line
          createdAt: 1,
          'profile.profession': 1,
          'profile.bio': 1,
        },
      });
  } else {
    this.ready();
  }
});

Meteor.publish('userList', function () {
  if (this.userId) {
    const currentUser = Meteor.users.findOne(this.userId);
    let fields = {
        username: 1,
        'profile.image': 1, // Updated this line
        emails: 1,
        status: 1,
        services: 1,
        createdAt: 1,
        'status.online': 1,
       };

    if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
      fields = { ...fields, 'adminField1': 1, 'adminField2': 1 };
    }

    return UsersCollection.find({}, {
      fields,
    });
  } else {
    this.ready();
  }
});
Meteor.publish('search', function (searchTerm, limit = 20) {
  if (!this.userId) {
    return this.ready();
  }

  check(searchTerm, String);
  check(limit, Number);

  const safeSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safeSearchTerm, 'i'); // 'i' flag for case-insensitive

  const userSearchQuery = {
    _id: { $ne: this.userId }, // Exclude the current user
    $or: [
      { username: { $regex: regex } },
      { 'emails.address': { $regex: regex } },
      { 'profile.telephone': { $regex: regex } },
    ],
  };

  const postSearchQuery = {
    $or: [
      { caption: { $regex: regex } },
      { description: { $regex: regex } },
    ],
  };

  const userSearchResults = Meteor.users.find(userSearchQuery, {
    fields: {
      username: 1,
      status: 1,
      createdAt: 1,
      'profile.image': 1,
    },
    limit,
  });

  const postSearchResults = PostsCollection.find(postSearchQuery, {
    fields: {
      caption: 1,
      description: 1,
      author: 1,
      createdAt: 1,
    },
    limit,
  });

  const userHandle = userSearchResults.observeChanges({
    added: (id, fields) => {
      this.added('searchResults', id, {
        type: 'user',
        ...fields,
      });
    },
    removed: (id) => {
      this.removed('searchResults', id);
    },
  });

  const postHandle = postSearchResults.observeChanges({
    added: (id, fields) => {
      this.added('searchResults', id, {
        type: 'post',
        ...fields,
      });
    },
    removed: (id) => {
      this.removed('searchResults', id);
    },
  });

  this.onStop(() => {
    userHandle.stop();
    postHandle.stop();
  });

  this.ready();
});
Meteor.publish('singleUser', function (userId) {
  if (!userId) {
    throw new Meteor.Error('invalid-user', 'User not defined');
  }

  check(userId, String);

  return Meteor.users.find(userId, {
    fields: {
      username: 1,
      status: 1,
      'profile.image': 1, // Updated this line
      friendRequests: 1,
      friends: 1,
      createdAt: 1,
      'profile.gender': 1,
      'profile.profession': 1,
      'profile.location': 1,
      'profile.maritalStatus': 1,
    },
  });
});

// Server: Publish user data including profile images
Meteor.publish('allUserProfiles', function () {
  return Meteor.users.find({}, {
    fields: {
      'profile.image': 1,
      'username': 1,
      // ... other fields you want to publish
    }
  });
});

Meteor.publish('userDetails', function (userId) {
  check(userId, String);

  if (!this.userId) {
    // if the user is not logged in, do not publish anything
    return this.ready();
  }

  // Assuming you want to publish data from two different collections
  const cursor1 = Meteor.users.find({ _id: userId });
  const cursor2 = UserProfiles.find({ authorId: userId });

  // Return an array of cursors
  return [cursor1, cursor2];
});

Meteor.publish('userProfileDetails', function (userId) {
  check(userId, String);

  if (!this.userId) {
    // if the user is not logged in, do not publish anything
    return this.ready();
  }

  // Correctly return a cursor
  return UserProfiles.find({ authorId: userId });
});
