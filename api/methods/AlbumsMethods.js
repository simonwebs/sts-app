import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { AlbumsCollection } from '../collections/AlbumsCollection';
import { UsersCollection } from '../collections/UsersCollection';
import { Random } from 'meteor/random';
const cloudinary = require('cloudinary').v2;

const cloud_name = Meteor.settings.private.cloudinary.CLOUD_NAME;
const apiKey = Meteor.settings.private.cloudinary.API_KEY;
const apiSecret = Meteor.settings.private.cloudinary.API_SECRET;

cloudinary.config({
  cloud_name,
  api_key: apiKey,
  api_secret: apiSecret,
});

UsersCollection._ensureIndex({ _id: 1 });
AlbumsCollection._ensureIndex({ _id: 1, 'comments.userId': 1 });

// Helper function to ensure user authorization
const ensureUserIsAuthorized = (userId, role = null) => {
  if (!userId) {
    throw new Meteor.Error('Not authorized.');
  }
  if (role && !Roles.userIsInRole(userId, role)) {
    throw new Meteor.Error('403', 'You do not have permission to perform this action.');
  }
};

Meteor.methods({
  'albums.create': async function (authorId, caption, base64Media) {
    // ensureUserIsAuthorized(this.userId, 'admin');  // Only 'admin' can create albums

    check(authorId, String);
    check(caption, String);
    check(base64Media, String);

    try {
      const mediaResult = await cloudinary.uploader.upload(base64Media, {
        resource_type: 'image',
        responsive: true,
        width: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });

      const albumId = Random.id();

      const album = {
        _id: albumId,
        authorId,
        loves: [],
        createdAt: new Date(),
        image: mediaResult.secure_url.replace('/upload/', '/upload/f_auto,q_auto/'),
        userId: authorId,
      };

      if (caption) album.caption = caption;

      AlbumsCollection.insert(album);

      return albumId;
    } catch (error) {
      throw new Meteor.Error('Upload failed', error.message);
    }
  },
  'albums.updateCaption' (albumId, newCaption) {
    check(albumId, String);
    check(newCaption, String);

    const album = AlbumsCollection.findOne(albumId);

    if (!album) {
      throw new Meteor.Error('Album not found');
    }

    AlbumsCollection.update(albumId, {
      $set: {
        caption: newCaption,
      },
    });
  },
  'albums.remove' (albumId) {
    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    const album = AlbumsCollection.findOne(albumId);

    if (!album) {
      throw new Meteor.Error('Post not found.');
    }

    if (album.authorId !== this.userId && !user.roles.includes('admin')) {
      throw new Meteor.Error('Not authorized.');
    }

    AlbumsCollection.remove(albumId);
  },

  'albums.delete' (albumId) {
    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    const album = AlbumsCollection.findOne(albumId);

    if (!album) {
      throw new Meteor.Error('Post not found');
    }

    if (album.authorId !== this.userId && !user.roles.includes('admin')) {
      throw new Meteor.Error('Not authorized.');
    }

    AlbumsCollection.remove(albumId);
  },

  'albums.edit' (albumId, newCaption) {
    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    check(albumId, String);
    check(newCaption, String);

    const album = AlbumsCollection.findOne(albumId);

    if (!album) {
      throw new Meteor.Error('Post not found.');
    }

    if (album.authorId !== this.userId && !user.roles.includes('admin')) {
      throw new Meteor.Error('You can only edit your own posts.');
    }

    AlbumsCollection.update(albumId, {
      $set: {
        caption: newCaption,
      },
    });
  },

});
