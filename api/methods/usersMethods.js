import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { UsersCollection } from '../collections/UsersCollection';
import cloudinary from 'cloudinary';

const { CLOUD_NAME, API_KEY, API_SECRET } = Meteor.settings.private.cloudinary;

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

UsersCollection._ensureIndex({ _id: 1 });

Meteor.methods({
  'users.updateProfile': function (key, value) {
    check(key, String);
    check(value, String);

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const updateObject = {};
    updateObject['profile.' + key] = value;
    Meteor.users.update(this.userId, { $set: updateObject });
  },
  'users.getUser': function (userId) {
    check(userId, String);

    const user = Meteor.users.findOne({ _id: userId }, { fields: { 'profile.image': 1, 'profile.bannerImage': 1 } });
    if (!user) {
      throw new Meteor.Error('User not found');
    }
    return user;
  },
  'user.get_login_token': function () {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }
    const stampedLoginToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(this.userId, stampedLoginToken);
    return stampedLoginToken.token;
  },
  'users.updateLastSeen': function () {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    UsersCollection.update(this.userId, {
      $set: {
        'status.lastSeen': new Date(),
      },
    });
  },
  'users.removeFriend' (userId, friendId) {
    check(userId, String);
    check(friendId, String);

    const user = Meteor.users.findOne(userId);
    if (!user) {
      throw new Meteor.Error('user-not-found', `User ${userId} not found`);
    }

    if (!Array.isArray(user.friends) || !user.friends.includes(friendId)) {
      throw new Meteor.Error('not-friends', `User ${userId} and ${friendId} are not friends`);
    }

    Meteor.users.update(userId, { $pull: { friends: friendId } });

    // Also remove from the friend's list
    Meteor.users.update(friendId, { $pull: { friends: userId } });
  },
  'users.getFriends' (userId) {
    check(userId, String);

    // This is just a sample and may not work in your context. You need to adjust it.
    const user = Meteor.users.findOne(userId);
    if (!user || !user.friends) {
      return [];
    }

    const friends = Meteor.users.find({ _id: { $in: user.friends } }).fetch();
    return friends;
  },
  'users.cancelFriendship' (targetId) {
    check(targetId, String);

    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      throw new Meteor.Error('Not authorized.');
    }

    // Remove the current user's ID from the target user's friends list
    UsersCollection.update(
      { _id: targetId },
      { $pull: { friends: currentUserId } },
    );

    // Remove the target user's ID from the current user's friends list
    UsersCollection.update(
      { _id: currentUserId },
      { $pull: { friends: targetId } },
    );
  },
  'users.profession': function (profession) {
    check(profession, String);
    // Make sure the user is logged in before making the change
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    Meteor.users.update(this.userId, { $set: { 'profile.profession': profession } });
  },
  'users.telephone': function (telephone) {
    check(telephone, String);
    // Make sure the user is logged in before making the change
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }
    Meteor.users.update(this.userId, { $set: { 'profile.telephone': telephone } });
  },
  'users.location': function (location) {
    check(location, String);
    // Make sure the user is logged in before making the change
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }
    Meteor.users.update(this.userId, { $set: { 'profile.location': location } });
  },
  'users.bio' (bio) {
    check(bio, String);

    // Make sure the user is logged in before executing this method
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    UsersCollection.update(this.userId, { $set: { 'profile.bio': bio } });
  },
  'users.updateGender': function (gender) {
    check(gender, String);
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('403', 'You must be logged in to update your gender');
    }

    Meteor.users.update({ _id: userId }, { $set: { 'profile.gender': gender } });
  },
  'users.getById': function (id) {
    check(id, String);

    // Find the user by ID and return only the necessary fields
    return Meteor.users.findOne(id, {
      fields: {
        username: 1,
        'profile.image': 1,
        'status.online': 1,
        'status.lastLogin.date': 1,
      },
    });
  },

  'users.maritalStatus' (maritalStatus) {
    check(maritalStatus, String);

    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    UsersCollection.update(this.userId, {
      $set: {
        'profile.maritalStatus': maritalStatus,
      },
    });
  },
  'users.sendFriendRequest' (targetUserId) {
    check(targetUserId, String);

    // the rest of your validations here...

    // update the target user's friendRequests
    UsersCollection.update(targetUserId, { $push: { friendRequests: this.userId } });

    // update the current user's sentRequests
    UsersCollection.update(this.userId, { $push: { sentRequests: targetUserId } });
  },

  'users.cancelFriendRequest' (targetId) {
    check(targetId, String);

    // the rest of your validations here...

    // remove the friend request from the target user's friendRequests
    UsersCollection.update(targetId, { $pull: { friendRequests: this.userId } });

    // remove the target user from the current user's sentRequests
    UsersCollection.update(this.userId, { $pull: { sentRequests: targetId } });
  },
  'users.acceptFriendRequest' (targetId) {
    check(targetId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const currentUser = UsersCollection.findOne(this.userId);

    if (!currentUser || !(currentUser.friendRequests && currentUser.friendRequests.includes(targetId))) {
      throw new Meteor.Error('Friend request not found.');
    }

    UsersCollection.update(this.userId, {
      $pull: { friendRequests: targetId },
      $addToSet: { friends: targetId },
    });

    UsersCollection.update(targetId, {
      $addToSet: { friends: this.userId },
    });
  },
  'friends.accept' (requesterId) {
    // Add to friends list and remove from friendRequests
    UsersCollection.update(
      { _id: this.userId },
      { $pull: { friendRequests: requesterId }, $push: { friends: requesterId } },
    );
    // Add to friends list of the requester as well
    UsersCollection.update(
      { _id: requesterId },
      { $push: { friends: this.userId } },
    );
  },
  'friends.reject' (requesterId) {
    // Remove from friendRequests
    UsersCollection.update(
      { _id: this.userId },
      { $pull: { friendRequests: requesterId } },
    );
  },
  'users.denyFriendRequest': function (targetId) {
    check(targetId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const currentUser = Meteor.users.findOne(this.userId);

    if (!currentUser || !(currentUser.friendRequests && currentUser.friendRequests.includes(targetId))) {
      throw new Meteor.Error('404', 'Friend request not found');
    }

    Meteor.users.update(this.userId, {
      $pull: { friendRequests: targetId },
    });
  },
  'users.blockFriend' (friendId) {
    check(friendId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const friend = UsersCollection.findOne(friendId);

    if (!friend) {
      throw new Meteor.Error('404', 'Friend not found');
    }

    UsersCollection.update(this.userId, {
      $addToSet: { blockedFriends: friendId },
    });
  },
  'users.declineFriendRequest' (targetId) {
    check(targetId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const currentUser = UsersCollection.findOne(this.userId);

    if (!currentUser || !(currentUser.friendRequests && currentUser.friendRequests.includes(targetId))) {
      throw new Meteor.Error('404', 'Friend request not found');
    }

    UsersCollection.update(this.userId, {
      $pull: { friendRequests: targetId },
    });

    UsersCollection.update(targetId, {
      $pull: { sentRequests: this.userId },
    });
  },
  'users.updateUsername' (newUsername) {
    check(newUsername, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (newUsername.trim() === '') {
      throw new Meteor.Error('Username cannot be empty.');
    }

    Meteor.users.update(this.userId, { $set: { username: newUsername } });
  },
  'users.updateColor' (color) {
    check(color, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Meteor.users.update(this.userId, { $set: { 'profile.color': color } });
  },
  'users.getUserById': function (userId) {
    check(userId, String);

    // Make sure the user is logged in before fetching user data
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Fetch the user data from the Meteor.users collection
    const user = Meteor.users.findOne({ _id: userId }, {
      fields: {
        username: 1,
        profile: 1,
        createdAt: 1,
      },
    });

    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found');
    }

    return user;
  },
  'refreshLoginToken' (userId, username) {
    check(userId, String);
    check(username, String);

    if (!this.userId || this.userId !== userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const stampedToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(userId, stampedToken);

    Meteor.users.update(userId, { $set: { username } });
    Meteor.users.update(userId, { $pop: { 'services.resume.loginTokens': -1 } });
  },

  getUserEmail: function () {
    const user = Meteor.users.findOne(this.userId);

    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    return user.emails[0].address;
  },
  'users.uploadBannerImage': async function (croppedImage) {
    check(croppedImage, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update your banner image');
    }

    try {
      // console.log('Uploading image to Cloudinary...');

      // Upload the cropped image to Cloudinary with transformations
      const result = await cloudinary.v2.uploader.upload(croppedImage, {
        folder: 'user_banners',
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
        transformation: [
          { width: 800, crop: 'scale' }, // Example transformation: adjust as needed
        ],
      });

      // console.log('Cloudinary upload successful:', result);

      // Update the user's banner image in the database with the URL from Cloudinary
      Meteor.users.update(this.userId, {
        $set: {
          'profile.bannerImage': result.secure_url, // Use secure_url to get the HTTPS link
        },
      });

      // console.log('User banner image updated successfully');
    } catch (error) {
      // console.error('Error uploading to Cloudinary:', error);
      throw new Meteor.Error('upload-failed', 'Failed to upload image to Cloudinary');
    }
  },

  'user.login' (usernameOrEmail, password) {
    const user = Accounts.findUserByUsername(usernameOrEmail) || Accounts.findUserByEmail(usernameOrEmail);

    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found');
    }

    // Check the password (note: this is a synchronous server-side function)
    const passwordCheck = Accounts._checkPassword(user, password);
    if (passwordCheck.error) {
      throw new Meteor.Error('password-check-failed', 'Password check failed');
    }

    // If you need to hash the token (for example, storing in a database or cookie)
    const hashedToken = Accounts._hashLoginToken(passwordCheck.stampedLoginToken.token);

    // Return the userId and the hashedToken
    return {
      userId: user._id,
      token: hashedToken,
    };
  },
  'users.uploadProfileImage': async function (base64Image) {
    console.log('Server method: users.uploadProfileImage invoked');
    check(base64Image, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      console.log('Uploading image to Cloudinary...');
      const result = await cloudinary.uploader.upload(base64Image, {
        resource_type: 'auto',
        responsive: true,
      });
      console.log('Cloudinary upload result:', result);

      const updateObject = {
        $set: {
          'profile.image': result.public_id,
        },
      };

      // Add information about the image update to the user's profile
      if (result.public_id) {
        updateObject.$push = {
          'profile.images': {
            publicId: result.public_id,
            timestamp: new Date(),
          },
        };
      }

      Meteor.users.update(this.userId, updateObject);

      console.log('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Meteor.Error('Upload failed', error.message);
    }
  },
  'users.updateProfileImage' (userId, selectedGalleryImage) {
    // Ensure the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User not authorized to update profile image.');
    }

    // Validate input
    check(userId, String);
    check(selectedGalleryImage, Object); // Update the validation based on your gallery image data structure

    // Your logic to update the profile image in the server-side database
    // Example: Update the user profile image data in the UsersCollection
    UsersCollection.update(
      { _id: userId },
      { $set: { 'profile.images': selectedGalleryImage } },
    );
  },
  'users.deleteImage' (publicId) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to delete images.');
    }

    // Validate the publicId and perform additional checks if needed

    // Remove the image from the user's profile
    UsersCollection.update({ _id: this.userId }, { $pull: { 'profile.images': { publicId } } });

    return 'Image deleted successfully.';
  },
  updateUserName (userId, newName) {
    check(userId, String);
    check(newName, String);

    // Implement the logic to update the name in the database
    // For example:
    Meteor.users.update({ _id: userId }, { $set: { 'profile.name': newName } });
  },
  likeProfile (profileId) {
    check(profileId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to like a profile');
    }

    // Check if the user has already liked this profile
    const alreadyLiked = Meteor.users.findOne({ _id: this.userId, 'profile.likes': profileId });

    if (alreadyLiked) {
      throw new Meteor.Error('already-liked', 'You have already liked this profile');
    }

    // Perform the like action
    Meteor.users.update(
      { _id: this.userId },
      { $addToSet: { 'profile.likes': profileId } },
    );

    // Update the liked user's profile to track the liker
    Meteor.users.update(
      { _id: profileId },
      { $addToSet: { 'profile.likedBy': this.userId } },
    );

    return true; // or any other value to indicate success
  },
});
