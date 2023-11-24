import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Random } from 'meteor/random';
import { PicturesCollection } from '../collections/PicturesCollection';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: Meteor.settings.private.cloudinary.CLOUD_NAME,
  api_key: Meteor.settings.private.cloudinary.API_KEY,
  api_secret: Meteor.settings.private.cloudinary.API_SECRET,
});

Meteor.methods({
  'pictures.create': async function (authorId, title, base64Media) {
    // Ensuring that the provided details are of the expected types.
    check(authorId, String);
    check(title, String);
    check(base64Media, Match.Maybe(String)); // allows for null or undefined
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    try {
      // Uploading the image to Cloudinary.
      const mediaResult = await cloudinary.uploader.upload(base64Media, {
        resource_type: 'image',
        responsive: true,
        width: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      const pictureId = Random.id();
      // Creating a picture object with required fields.
      const picture = {
        _id: pictureId,
        authorId,
        title,
        createdAt: new Date(),
        image: mediaResult.secure_url.replace('/upload/', '/upload/f_auto,q_auto/'),
        userId: authorId,
        loves: [],
      };

      // Inserting the picture object into the PicturesCollection.
      PicturesCollection.insert(picture);

      // Returning the _id of the newly created picture.
      return picture._id;
    } catch (error) {
      throw new Meteor.Error('Upload failed', error.message);
    }
  },
});
