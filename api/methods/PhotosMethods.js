import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Photos } from '../collections/Photos';
import cloudinary from 'cloudinary';

const { CLOUD_NAME, API_KEY, API_SECRET } = Meteor.settings.private.cloudinary;

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

Photos._ensureIndex({ authorId: 1 }, { unique: true });

// Define Meteor methods
Meteor.methods({
  'users.uploadProfileImages': async function (base64Image) {
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

      // Insert a new document in the Photos collection
      Photos.insert({
        userId: this.userId,
        photoUrl: result.public_id,
        isProfilePhoto: true,
      });

      console.log('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Meteor.Error('Upload failed', error.message);
    }
  },
});
