import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { AlbumsCollection } from '../collections/AlbumsCollection';

Meteor.startup(() => {
  // Indexes for efficient queries
  AlbumsCollection.rawCollection().createIndex({ authorId: 1 });
  AlbumsCollection.rawCollection().createIndex({ caption: 'text' });
});

const USER_FIELDS = {
  username: 1,
  'profile.image': 1,
};

publishComposite('albumsWithAuthors', function (limit = 20) {
  // Ensure limit is a number and is greater than 0
  limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  limit = Math.max(limit, 1);

  return {
    find: function () {
      // Find albums with a limit
      return AlbumsCollection.find({}, {
        fields: {
          authorId: 1,
          createdAt: 1,
          image: 1,
          caption: 1,
          loves: 1,
        },
        limit,
      });
    },
    children: [
      {
        find: function (album) {
          // Find the author of each album
          return Meteor.users.find(
            { _id: album.authorId },
            { fields: USER_FIELDS },
          );
        },
      },
    ],
  };
});
