import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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
Meteor.publish('singleUser', function (userId) {
  return Meteor.users.find({ _id: userId }, { fields: { profile: 1 } });
});

Meteor.publish('userData', function () {
  if (!this.userId) {
    // If the user is not logged in, do not publish data
    return this.ready();
  }

  const usersCursor = Meteor.users.find({}, { fields: { 'profile.username': 1, 'profile.images': 1, 'profile.birthDate': 1, 'profile.personalBio': 1, status: 1 } });
  const userProfilesCursor = UserProfiles.find({}, { fields: { personalBio: 1, birthDate: 1 } });

  console.log('Publishing users data:', usersCursor.fetch());
  console.log('Publishing user profiles data:', userProfilesCursor.fetch());

  return [usersCursor, userProfilesCursor];
});

Meteor.publish('allUsers', function (page = 0, pageSize = 5) {
  check(page, Number);
  check(pageSize, Number);

  const fields = {
    username: 1,
    'profile.images': 1,
    status: 1,
    createdAt: 1,
  };

  const usersDataCursor = Meteor.users.find({}, {
    skip: page * pageSize,
    limit: pageSize,
    fields,
  });

  const userIds = usersDataCursor.fetch().map(user => user._id);
  const userProfileDataCursor = UserProfiles.find({ authorId: { $in: userIds } });
  console.log('userProfileDataCursor count:', userProfileDataCursor.count());

  // Return an array of Cursors
  return [usersDataCursor, userProfileDataCursor];
});

// Server-side publication
Meteor.publish('users.getById', function (userId) {
  check(userId, String);
  return Meteor.users.find({ _id: userId }, {
    fields: {
      username: 1,
      authorId: 1,
      'profile.images': 1,
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
      'profile.images': 1, // Updated this line
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
      return UserProfiles.find({ userId });
    } else {
      // Any logged-in user requesting someone else's profile
      return UserProfiles.find({ userId }, {
        fields: {
          // List the fields you want to be publicly available to other users
          firstName: 1,
          lastName: 1,
          birthDate: 1,
          bodyHeight: 1,
          biologicalGender: 1,
          personalBio: 1,
          lookingForGender: 1,
          agePreferenceMin: 1,
          agePreferenceMax: 1,
          country: 1,
          city: 1,
          profilePhotos: 1,
        },
      });
    }
  } else {
    // If no valid userId is provided, don't send any data
    return this.ready();
  }
});

Meteor.publish('profileData', function (userId) {
  check(userId, String);

  if (!this.userId || this.userId !== userId) {
    // Optional: Depending on your app's privacy requirements, you might not want to throw an error here.
    return this.ready();
  }

  return Meteor.users.find({ _id: userId }, {
    fields: {
      username: 1,
      'profile.images': 1,
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
          'profile.images': 1, // Updated this line
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
      'profile.images': 1,
      emails: 1,
      status: 1,
      services: 1,
      createdAt: 1,
      'status.online': 1,
    };

    if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
      fields = { ...fields, adminField1: 1, adminField2: 1 };
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
      { 'profile.age': { $regex: regex } }, // Include age search
      { 'profile.country': { $regex: regex } }, // Include country search
      { 'profile.city': { $regex: regex } }, // Include city search
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
      'profile.images': 1,
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

// Meteor.publish('allUsersDetails', function () {
//   const usersCursor = Meteor.users.find({}, {
//     fields: {
//       username: 1,
//        authorId: 1,
//       'profile.firstName': 1,
//       'profile.lastName': 1,
//       'profile.images': 1,
//       'status.online': 1,
//       'status.lastLogin.date': 1,
//       'profile.personalBio': 1,
//       'profile.birthDate': 1,
//       profileCreatedAt: 1,
//       disability: 1,
//       disabilityDescription: 1,
//       behavior: 1,
//       relationshipPreferences: 1,
//       bodyHeight: 1,
//       biologicalGender: 1,
//       lookingForGender: 1,
//       lookingForBodyHeight: 1,
//       lookingForBodyType: 1,
//       agePreferenceMin: 1,
//       agePreferenceMax: 1,
//       country: 1,
//       city: 1,
//       status: 1,
//       likedByUsers: 1,
//       matches: 1,
//       compatibility: 1,
//     },
//   });

//   console.log('Added to usersCursor:', usersCursor.fetch());

//   return usersCursor;
// });
Meteor.publish('allUsersDetails', function () {
  if (!this.userId) {
    // If the user is not logged in, do not publish anything
    return this.ready();
  }

  const currentUser = Meteor.users.findOne({ _id: this.userId });

  if (!currentUser) {
    // If the current user is not found, return ready
    return this.ready();
  }
 console.log('Publishing current user details:', currentUser);

  // Add the current user's details to the publication
  this.added('users', currentUser._id, {
    username: currentUser.username,
    authorId: currentUser.authorId,
    profile: currentUser.profile,
    status: currentUser.status,
    hasDisability: currentUser.disability ? currentUser.disability.hasDisability : false,
    disabilityDescription: currentUser.disability ? currentUser.disability.disabilityDescription : '',
    interests: currentUser.interests || [],
    relationship: currentUser.relationshipPreferences || 'marriage', // Assuming a default value
    // Add other necessary fields from the profile
  });

  // Fetch user profiles excluding the current user
  const usersCursor = Meteor.users.find(
    { _id: { $ne: this.userId } },
    {
      fields: {
        username: 1,
        authorId: 1,
        profile: 1,
        status: 1,
        disability: 1,
        interests: 1,
        relationshipPreferences: 1,
        // Add other necessary fields from the profile
      },
    },
  );

  // Loop through user profiles and add them to the publication
  usersCursor.forEach((user) => {
    this.added('users', user._id, {
      username: user.username,
      authorId: user.authorId,
      profile: user.profile,
      status: user.status,
      hasDisability: user.disability ? user.disability.hasDisability : false,
      disabilityDescription: user.disability ? user.disability.disabilityDescription : '',
     interests: user.interests || [],
      relationship: user.relationshipPreferences || 'marriage', // Assuming a default value
      // Add other necessary fields from the profile
    });
  });

  // Fetch user gallery images for the current user
  const currentUserImages = UsersCollection.findOne({ _id: this.userId });

  if (currentUserImages && currentUserImages.profile && currentUserImages.profile.images) {
    currentUserImages.profile.images.forEach((image, index) => {
      this.added('UsersCollectionImages', `${this.userId}_${index}`, image);
    });
  }

  return this.ready();
});

// Define the publication for user gallery images
Meteor.publish('userGalleryImages', function () {
  if (!this.userId) {
    // If the user is not logged in, do not publish anything
    return this.ready();
  }

  const userId = this.userId;

  console.log('Publishing user gallery images for userId:', userId);

  // Find the user by ID
  const user = UsersCollection.findOne({ _id: userId });

  if (user && user.profile && user.profile.images) {
    // Add user's profile images to the publication
    user.profile.images.forEach((image, index) => {
      this.added('UsersCollectionImages', `${userId}_${index}`, image);
    });
  }

  this.ready();
});

Meteor.publish('userProfileDetails', function (userId) {
  // We check if the userId is a string, but we also handle the case where it might be undefined
  if (typeof userId !== 'string') {
    this.ready();
    return;
  }

  // Now that we've handled the undefined case, we can safely assume userId is a string
  const userProfile = UserProfiles.findOne({ authorId: userId });
  if (!userProfile) {
    this.ready();
    return;
  }

  return UserProfiles.find({ authorId: userId });
});

Meteor.publish('userContacts', function () {
  // console.log('userContacts publication called');
  // console.log('Current userId:', this.userId); // Log the current userId
  if (!this.userId) {
    return this.ready();
  }
  return Meteor.users.find(
    { _id: { $ne: this.userId } },
    {
      fields: {
        username: 1,
        'profile.images': 1,
        status: 1,
      },
    },
  );
});

Meteor.publish('userProfilesSearch', function (searchQuery) {
  const searchResults = UserProfiles.find({
    $or: [
      { firstName: { $regex: searchQuery, $options: 'i' } },
      { lastName: { $regex: searchQuery, $options: 'i' } },
      { country: { $regex: searchQuery, $options: 'i' } },
      { city: { $regex: searchQuery, $options: 'i' } },
      // Add additional fields for matching here based on your schema
    ],
  });

  return searchResults;
});

Meteor.publish('currentUserData', function () {
  if (!this.userId) {
    // If the user is not logged in, stop the publication
    return this.ready();
  }

  // Return the relevant data for the current user
  return UsersCollection.find(
    { _id: this.userId },
    {
      fields: {
        'profile.images': 1,
        username: 1,
      },
    },
  );
});
