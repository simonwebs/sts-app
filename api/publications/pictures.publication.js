import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { PicturesCollection } from '../collections/PicturesCollection';

// Publish pictures with their authors
publishComposite('picturesWithAuthors', function () {
  if (!this.userId) {
    return this.ready();
  }

  return {
    find: function () {
      return PicturesCollection.find({}, {
        fields: {
          authorId: 1,
          createdAt: 1,
          image: 1,
          title: 1,
          loves: 1,
        },
      });
    },
    children: [
      {
        find: function (picture) {
          return Meteor.users.find(
            { _id: picture.authorId },
            { fields: { username: 1, 'profile.image': 1 } },
          );
        },
      },
    ],
  };
});
Meteor.publish('pictureSearch', function (searchTerm, limit = 10, skip = 0) {
  if (!this.userId) {
    return this.ready();
  }

  check(searchTerm, String);
  check(limit, Number);
  check(skip, Number);

  const safeSearchTerm = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (!safeSearchTerm) {
    return this.ready();
  }

  const regex = new RegExp(`^${safeSearchTerm}`, 'i'); // Starting with the search term can use indexes more efficiently

  return PicturesCollection.find(
    { title: { $regex: regex } },
    {
      fields: {
        title: 1,
        author: 1,
        createdAt: 1,
      },
      limit,
      skip,
    },
  );
});
