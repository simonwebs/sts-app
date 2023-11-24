import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { PostsCollection } from '../collections/posts.collection';
import { CommentsCollection } from '../collections/CommentsCollection';

CommentsCollection._ensureIndex({
  postId: 1,
  userId: 1,
});

// Production-level postId validation
const validatePostId = (postId) => {
  if (!postId || typeof postId !== 'string') {
    // Log this error to your logging service
    // logError('Invalid postId:', postId);

    throw new Meteor.Error('invalid-postid', 'The provided postId is invalid.');
  }
};

Meteor.publishComposite('commentsForPost', function (postId) {
 // console.log("Fetching comments for post with ID:", postId);
  try {
    validatePostId(postId);
  } catch (error) {
    this.error(error);
    return;
  }

  return {
    find: function () {
      return CommentsCollection.find({ postId, parentId: { $exists: false } }, {
        fields: {
          postId: 1,
          authorId: 1,
          content: 1,
          createdAt: 1,
        },
      });
    },
    children: [
      {
        find: function (comment) {
          return Meteor.users.find(
            { _id: comment.authorId },
            { fields: { username: 1, 'profile.image': 1 } },
          );
        },
        children: [
          {
            find: function (comment, user) {
              comment.author = user;
              return null;
            },
          },
        ],
      },
    ],
  };
});

Meteor.publish('comments', function () {
  return CommentsCollection.find();
});
Meteor.publish('singlePost', function (postId) {
  if (!postId) {
    return this.ready();
  }

  check(postId, String);
  return PostsCollection.find({ _id: postId });
});
Meteor.publish('commentsWithReplies', function (postId) {
  return CommentsCollection.find({ postId });
});
Meteor.publishComposite('postsWithAuthors', function () {
  // Removed the login check; now all users can subscribe to this publication

  return {
    find: function () {
      return PostsCollection.find({}, {
        fields: {
          authorId: 1,
          createdAt: 1,
          image: 1,
          caption: 1,
          description: 1,
          loves: 1,
          views: 1,
          category: 1,
        },
      });
    },
    children: [
      {
        find: function (post) {
          return Meteor.users.find(
            { _id: post.authorId },
            { fields: { username: 1, 'profile.image': 1 } },
          );
        },
      },
    ],
  };
});

// Ensure you have indexes on the fields you're searching
PostsCollection._ensureIndex({
  caption: 'text',
  description: 'text',
  category: 'text',
});

// Publish posts of a specific category
publishComposite('posts.byCategory', function (category) {
  check(category, String);
  if (!category) {
    throw new Meteor.Error('Category not provided');
  }
  return {
    find: function () {
      return PostsCollection.find({ category }, {
        fields: {
          authorId: 1,
          createdAt: 1,
          image: 1,
          caption: 1,
          description: 1,
          loves: 1,
          category: 1,
        },
      });
    },
    children: [
      {
        find: function (post) {
          return Meteor.users.find(
            { _id: post.authorId },
            { fields: { username: 1, 'profile.image': 1 } },
          );
        },
      },
    ],
  };
});
// In your server-side code
Meteor.publish('post.byCategoryAndId', function (categoryName, postId) {
  return PostsCollection.find({ _id: postId, category: categoryName });
});
// Publish post count by category
Meteor.publish('postCount.byCategory', function (category) {
  check(category, String);

  const count = PostsCollection.find({ category }).count();
  this.added('postCounts', category, { count });
  this.ready();
});
Meteor.publish('likedPosts', function (userId) {
  return PostsCollection.find({ 'lovedBy': userId });
});

Meteor.publish('myComments', function (userId) {
  return CommentsCollection.find({ 'authorId': userId });
});