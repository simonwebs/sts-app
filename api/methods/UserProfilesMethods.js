import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { UserProfiles } from '../collections/UserProfiles';
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with settings from Meteor.settings
cloudinary.config({
  cloud_name: Meteor.settings.private.cloudinary.CLOUD_NAME,
  api_key: Meteor.settings.private.cloudinary.API_KEY,
  api_secret: Meteor.settings.private.cloudinary.API_SECRET,
});

Meteor.methods({
  'userProfiles.create': async function (profileData, base64Images) {
    check(profileData, Match.ObjectIncluding({
      firstName: String,
      lastName: String,
      birthDate: String,
      bodyHeight: String,
      biologicalGender: String,
      personalBio: String,
      lookingForGender: String,
      lookingForBodyHeight: String,
      lookingForBodyType: String,
      agePreferenceMin: Match.Maybe(Number),
      agePreferenceMax: Match.Maybe(Number),
      country: String,
      city: String,
    }));

    check(base64Images, [String]);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.', 'You must be logged in to create a profile.');
    }

    const existingProfile = UserProfiles.findOne({ authorId: this.userId });
    if (existingProfile) {
      throw new Meteor.Error('profile-exists', 'You already have a profile.');
    }

    const uploadPromises = base64Images.map(base64Image => {
      return cloudinary.uploader.upload(base64Image, {
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
    });

    try {
      const images = await Promise.all(uploadPromises);
      const profilePhotos = images.map(image => ({
        photoUrl: image.secure_url,
        isProfilePhoto: false,
      }));

      return UserProfiles.insert({
        ...profileData,
        authorId: this.userId,
        createdAt: new Date(),
        profilePhotos,
        likedByUsers: [],
        matches: [],
      });
    } catch (error) {
      throw new Meteor.Error('cloudinary-upload-failed', 'Failed to upload image to Cloudinary.');
    }
  },
  // Server-side method to handle a like action
'userProfiles.like': function (profileId) {
  check(profileId, String);

  if (!this.userId) {
    throw new Meteor.Error('not-authorized', 'You must be logged in to like a profile.');
  }

  const userProfile = UserProfiles.findOne({ _id: profileId });

  if (!userProfile) {
    throw new Meteor.Error('profile-not-found', 'Profile not found.');
  }

  // Prevent users from liking a profile more than once
  if (userProfile.likedByUsers.includes(this.userId)) {
    throw new Meteor.Error('already-liked', 'You have already liked this profile.');
  }

  // Add the current user's ID to the likedByUsers array
  UserProfiles.update(profileId, {
    $push: { likedByUsers: this.userId }
  });

  return 'Profile liked successfully.';
},
  'users.uploadProfileImage': async function (base64Image) {
    check(base64Image, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    try {
      const result = await cloudinary.uploader.upload(base64Image, {
        resource_type: 'auto',
        responsive: true,
      });

      Meteor.users.update(this.userId, {
        $set: {
          'profile.image': result.public_id,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Upload failed', error.message);
    }
  },
  'userProfiles.setProfileImage'(newImageUrl) {
    // Check the newImageUrl argument to ensure it is a string
    check(newImageUrl, String);

    // Make sure the user is logged in before proceeding
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update your profile image.');
    }

    // Update the user's profile image
    const result = UserProfiles.update(
      { authorId: this.userId }, // Ensuring the operation is performed on the logged-in user's profile
      { $set: { 'profilePhotos.$.isProfilePhoto': false }, // Reset isProfilePhoto for all
        $set: { 'profilePhotos.$[elem].isProfilePhoto': true } }, // Set isProfilePhoto for the chosen one
      { arrayFilters: [{ "elem.photoUrl": newImageUrl }] } // Use arrayFilters to identify the correct photo
    );

    // If the update operation didn't affect any documents, throw an error
    if (result.nModified === 0) {
      throw new Meteor.Error('update-failed', 'Failed to update profile image.');
    }
  },
});
