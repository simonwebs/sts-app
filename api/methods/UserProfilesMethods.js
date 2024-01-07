import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { UserProfiles } from '../collections/UserProfiles';
import { Photos } from '../collections/Photos';
import cloudinary from 'cloudinary';

const { CLOUD_NAME, API_KEY, API_SECRET } = Meteor.settings.private.cloudinary;

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

UserProfiles._ensureIndex({ authorId: 1 }, { unique: true });

// Define Meteor methods
Meteor.methods({
  'photos.upload' (fileData) {
  // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to upload a photo.');
    }

    // Wrap the asynchronous Cloudinary upload function
    const uploadToCloudinary = Meteor.wrapAsync(cloudinary.v2.uploader.upload);

    try {
    // Upload the image to Cloudinary
      const cloudinaryResponse = uploadToCloudinary(fileData, { folder: 'user-photos' });

      // Insert the photo into the Photos collection
      const photoId = Photos.insert({
        userId: this.userId,
        publicId: cloudinaryResponse.public_id,
        photoUrl: cloudinaryResponse.secure_url,
        isProfilePhoto: false,
      });

      return photoId;
    } catch (error) {
      console.error('Error uploading and updating profile photo:', error);
      throw new Meteor.Error('upload-error', 'Error uploading and updating profile photo.');
    }
  },

  'userProfiles.exists': function (userId) {
    check(userId, String);
    return !!UserProfiles.findOne({ authorId: userId });
  },

  'userProfiles.setProfileImage': function (profileId, newImageUrl) {
    check(profileId, String);
    check(newImageUrl, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update your profile image.');
    }

    try {
      UserProfiles.update(
        { _id: profileId, 'profilePhotos.photoUrl': newImageUrl },
        {
          $set: { 'profilePhotos.$.isProfilePhoto': true },
        },
      );
    } catch (error) {
      throw new Meteor.Error('Update failed', error.message);
    }
  },
  'userProfiles.create': function (preparedData) {
    console.log('Received data on server:', preparedData);

    check(preparedData, Match.ObjectIncluding({
      firstName: String,
      lastName: String,
      birthDate: String,
      bodyHeight: String,
      biologicalGender: String,
      personalBio: String,
      lookingForGender: String,
      lookingForBodyHeight: String,
      lookingForBodyType: String,
      profileCreatedAt: Match.Maybe(Date),
      agePreferenceMin: Match.Maybe(Number),
      agePreferenceMax: Match.Maybe(Number),
      country: String,
      city: String,
      agreedToTerms: Boolean,
      relationshipPreferences: Object,
      disability: Object,
      behavior: Object,
      interests: Match.Maybe(Array),
      likedByUsers: Array,
      matches: Array,
    }));

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to create a profile.');
    }

    const existingProfile = UserProfiles.findOne({ authorId: this.userId });
    if (existingProfile) {
      throw new Meteor.Error('profile-exists', 'You already have a profile.');
    }

    // Map interests array to ensure it contains valid objects
    const interests = (preparedData.interests || []).map((interest) => ({
      interestName: interest?.interestName || 'N/A',
    }));

    try {
    // Insert into UserProfiles collection with updated interests
      const userProfileId = UserProfiles.insert({
        ...preparedData,
        authorId: this.userId,
        createdAt: new Date(),
        likedByUsers: [],
        matches: [],
        agreedToTerms: preparedData.agreedToTerms,
        profileCreatedAt: preparedData.profileCreatedAt || null,
        interests,
      });

      // Insert into Meteor.users collection
      Meteor.users.update(this.userId, {
        $set: {
          profile: {
            ...preparedData,
            image: null,
          },
        },
      });

      return userProfileId;
    } catch (error) {
      console.error('Error during user profile creation:', error);
      throw new Meteor.Error('profile-creation-failed', 'Failed to create the user profile.');
    }
  },
});
