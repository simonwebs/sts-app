import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { PostsCollection } from '../collections/posts.collection';
import { UsersCollection } from '../collections/UsersCollection';
import { CommentsCollection } from '../collections/CommentsCollection';
import { Random } from 'meteor/random';
import cloudinary from 'cloudinary';

const { CLOUD_NAME, API_KEY, API_SECRET } = Meteor.settings.private.cloudinary;

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

UsersCollection._ensureIndex({ _id: 1 });
PostsCollection._ensureIndex({ _id: 1, 'comments.userId': 1 });

const fetchComments = (postId, parentCommentId = null, limit = 10) => {
  const comments = CommentsCollection.find({ postId, parentCommentId }, { limit }).fetch();
  for (const comment of comments) {
    comment.childComments = fetchComments(postId, comment._id);
  }
  return comments;
};

Meteor.methods({
  async 'posts.create' (data) {
    const { authorId, caption, description, link, base64Media, isVideo, base64Thumbnail, category } = data;
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.', 'User is not logged in.');
    }

    if (!authorId) {
      throw new Meteor.Error('Not authorized.', 'AuthorId is missing.');
    }
    const resourceType = isVideo ? 'video' : 'image';
    const mediaResult = await cloudinary.v2.uploader.upload(base64Media, {
      resource_type: resourceType,
      responsive: true,
      width: 'auto',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    const postId = Random.id();
    const post = {
      _id: postId,
      authorId,
      category,
      comments: [],
      shares: 0,
      loves: [],
      createdAt: new Date(),
      image: mediaResult.secure_url.replace('/upload/', '/upload/f_auto,q_auto/'),
      userId: authorId,
      ...(caption && { caption }),
      ...(description && { description }),
      ...(link && { link }),
    };

    if (base64Thumbnail) {
      const thumbnailResult = await cloudinary.v2.uploader.upload(base64Thumbnail, {
        resource_type: 'image',
        responsive: true,
        width: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      post.thumbnail = thumbnailResult.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    PostsCollection.insert(post);
    return postId;
  },
  'posts.remove'(postId) {
    // Check if the user is authorized to delete the post (implement your authorization logic here)
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to delete this post.');
    }

    // Remove the post from the collection
    PostsCollection.remove(postId);
  },
  getPostCountByCategory: function (category) {
    if (typeof category !== 'string') {
      throw new Meteor.Error(400, 'Category must be a string');
    }

    // Ensure user is logged in before proceeding
    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    return PostsCollection.find({ category }).count();
  },

  'posts.addRemoveComment' (action, commentId, postId, commentText) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (action === 'remove') {
      const comment = CommentsCollection.findOne(commentId);
      if (!comment || comment.userId !== this.userId) {
        throw new Meteor.Error('Comment not found or not authorized.');
      }
      CommentsCollection.remove(commentId);
    } else if (action === 'add') {
      const post = PostsCollection.findOne(postId);
      if (!post) {
        throw new Meteor.Error('Post not found.');
      }

      CommentsCollection.insert({
        postId,
        authorId: this.userId,
        text: commentText,
        createdAt: new Date(),
      });
    }
  },
  'posts.update'(postId, updatedPost) {
    check(postId, String);
    check(updatedPost, Object);

    const post = PostsCollection.findOne(postId); // Fetch the post
    if (!post) {
      throw new Meteor.Error('Post not found.');
    }

    const user = Meteor.users.findOne(this.userId);
    if (!user || (post.authorId !== this.userId && !user.isAdmin)) {
      throw new Meteor.Error('Not authorized.');
    }z

    PostsCollection.update(postId, { $set: updatedPost });
  },
  async 'getDistinctCategories' () {
    const categoryCounts = await PostsCollection.rawCollection().aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).toArray();

    const distinctCategories = categoryCounts.map(cat => cat._id);
    const authorIds = await PostsCollection.rawCollection().distinct('authorId');
    const users = Meteor.users.find({ _id: { $in: authorIds } }, { fields: { _id: 1, profile: 1, username: 1 } }).fetch();

    const categoriesWithLatestPost = distinctCategories.map(category => {
      const latestPost = PostsCollection.findOne({ category }, { sort: { createdAt: -1 } });
      const postCount = categoryCounts.find(cat => cat._id === category).count;
      return {
        name: category,
        latestPost,
        postCount,
      };
    });

    return {
      categories: categoriesWithLatestPost,
      authors: users,
    };
  },
  'post.modify' (action, postId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not authorized.');
    }

    const post = PostsCollection.findOne(postId);
    if (!post) {
      throw new Meteor.Error('Post not found.');
    }

    if (post.authorId !== this.userId && !user.isAdmin) {
      throw new Meteor.Error('Not authorized.');
    }

    if (action === 'remove') {
      PostsCollection.remove(postId);
    } else if (action === 'love') {
      const loveAction = post.loves.includes(this.userId) ? { $pull: { loves: this.userId } } : { $push: { loves: this.userId } };
      PostsCollection.update(postId, loveAction);
    } else if (action === 'view') {
      PostsCollection.update(postId, { $inc: { views: 1 } });
    }
  },
  'posts.getPost' (postId) {
    return PostsCollection.findOne(postId);
  },
  'posts.edit' (postId, caption, description) {
    const post = PostsCollection.findOne(postId);
    if (!post) {
      throw new Meteor.Error('Post not found.');
    }

    if (post.authorId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    PostsCollection.update(postId, { $set: { caption, description } });
  },
  'toggleCommentLove' (commentId) {
    check(commentId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const comment = CommentsCollection.findOne(commentId);
    const lovedByCurrentUser = comment.lovedBy?.includes(this.userId);

    if (lovedByCurrentUser) {
      CommentsCollection.update(commentId, { $pull: { lovedBy: this.userId }, $inc: { loves: -1 } });
    } else {
      CommentsCollection.update(commentId, { $addToSet: { lovedBy: this.userId }, $inc: { loves: 1 } });
    }
  },
  'posts.getComments' (postId) {
    const fetchComments = (parentId = null) => {
      return CommentsCollection.find({ postId, parentId }).fetch().map(comment => {
        comment.childComments = fetchComments(comment._id);
        return comment;
      });
    };

    return fetchComments();
  },
  'comments.add': function (commentData) {
   // console.log('Received commentData:', commentData);

    // Check for a logged-in user
    if (!this.userId) {
      throw new Meteor.Error('403', 'You must be logged in to add a comment.');
    }

    // Validate incoming data
    check(commentData, Match.ObjectIncluding({
      authorId: String,
      postId: Match.Maybe(Match.OneOf(String, null)), // Allow either String or null
      parentId: Match.Maybe(Match.OneOf(String, null)), // Allow either String or null
      content: String,
    }));

    // If there's a parentId, ensure it exists in the database
    if (commentData.parentId) {
      const parentComment = CommentsCollection.findOne({ _id: commentData.parentId });
      if (!parentComment) {
        throw new Meteor.Error('404', 'Parent comment not found');
      }

      // Prevent duplicate replies for the same parent comment
      const existingReply = CommentsCollection.findOne({
        parentId: commentData.parentId,
        content: commentData.content,
        authorId: this.userId,
      });

      if (existingReply) {
        throw new Meteor.Error('409', 'Duplicate reply detected');
      }
    }

    // Add username and user image URL to comment
    const user = Meteor.users.findOne(this.userId);
    if (user) {
      commentData.authorUsername = user.username;
      commentData.authorImage = user.profile.image;
    }

    // Insert comment into collection
    const commentId = CommentsCollection.insert({
      ...commentData,
      createdAt: new Date(),
      loves: 0,
      lovedBy: [],
      replies: [],
    });

    // Create a reply object based on the commentId
    const replyObject = {
      commentId,
      userId: this.userId,
      text: commentData.content,
      createdAt: new Date(),
    };

    // If this is a reply, update the parent comment to include this reply
    if (commentData.parentId) {
      const commentId = CommentsCollection.insert({
        ...commentData,
        createdAt: new Date(),
        loves: 0,
        lovedBy: [],
      });
      return commentId;
    }
  },
  'posts.addOrRemoveLove': function (postId, addLove) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    if (addLove) {
      PostsCollection.update(postId, {
        $inc: { loveCount: 1 },
        $addToSet: { lovedBy: this.userId },
      });
    } else {
      PostsCollection.update(postId, {
        $inc: { loveCount: -1 },
        $pull: { lovedBy: this.userId },
      });
    }
  },
  'comment.toggleLove': function (commentId, userId) {
    const comment = CommentsCollection.findOne(commentId);
    let lovedBy = comment.lovedBy || [];

    if (lovedBy.includes(userId)) {
      lovedBy = lovedBy.filter(id => id !== userId);
    } else {
      lovedBy.push(userId);
    }

    CommentsCollection.update(commentId, {
      $set: {
        lovedBy,
      },
    });
  },
  'post.toggleLove': function (postId, userId) {
    const post = PostsCollection.findOne(postId);
    let lovedBy = post.lovedBy || [];

    if (lovedBy.includes(userId)) {
      lovedBy = lovedBy.filter(id => id !== userId);
    } else {
      lovedBy.push(userId);
    }

    PostsCollection.update(postId, {
      $set: {
        lovedBy,
      },
    });
  },
  'posts.updateLoveCount' (postId, newCount) {
    // Perform your security checks here

    PostsCollection.update(
      { _id: postId },
      { $set: { loveCount: newCount } },
    );
  },
  // Add logging to check returned replies
  'comments.getReplies': function (commentId) {
    if (!commentId) {
      throw new Meteor.Error('commentId-required', 'Comment ID is required');
    }

    // Fetch replies from MongoDB where the parentId is the given commentId
    const replies = CommentsCollection.find({ parentId: commentId }).fetch();

   // console.log('Returned Replies: ', replies); // Log to inspect

    // Add author information to each reply
    const repliesWithAuthor = replies.map(reply => {
      const author = Meteor.users.findOne({ _id: reply.authorId });
      return {
        ...reply,
        authorUsername: author?.username,
        authorImage: author?.profile?.image,
      };
    });

    return repliesWithAuthor;
  },
   'comments.likeComment': function (commentId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to like a comment.');
    }

    const comment = CommentsCollection.findOne(commentId);
    if (!comment) {
      throw new Meteor.Error('comment-not-found', 'Comment not found.');
    }

    if (comment.likedBy && comment.likedBy.includes(this.userId)) {
      throw new Meteor.Error('already-liked', 'You have already liked this comment.');
    }

    CommentsCollection.update(
      { _id: commentId },
      {
        $inc: { likeCount: 1 },
        $addToSet: { likedBy: this.userId }
      },
    );

    // Assuming you have set up a proper logging system
    Logger.info(`Comment ${commentId} liked by user ${this.userId}`);
  },

  'comments.like': function (commentId, replyId) {
    const userId = this.userId; // get the current user id
    if (!userId) {
      throw new Meteor.Error('401', 'Not authorized');
    }

    const query = replyId ? { /* query for reply */ } : { _id: commentId };

    const commentOrReply = CommentsCollection.findOne(query);
    if (!commentOrReply) {
      throw new Meteor.Error('404', 'Comment or reply not found');
    }

    if (commentOrReply.likedBy && commentOrReply.likedBy.includes(userId)) {
      return { likeCount: commentOrReply.likeCount }; // Return existing like count
    }

    const updatedLikeCount = (commentOrReply.likeCount || 0) + 1;
    CommentsCollection.update(query, {
      $set: { likeCount: updatedLikeCount },
      $push: { likedBy: userId },
    });

    return { likeCount: updatedLikeCount };
  },
  'comments.unlike': function (commentId, replyId) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error('401', 'Not authorized');
    }

    const query = replyId ? { /* query for reply */ } : { _id: commentId };
    const commentOrReply = CommentsCollection.findOne(query);

    if (!commentOrReply) {
      throw new Meteor.Error('404', 'Comment or reply not found');
    }

    if (commentOrReply.likedBy && commentOrReply.likedBy.includes(userId)) {
      const updatedLikeCount = (commentOrReply.likeCount || 0) - 1;

      CommentsCollection.update(query, {
        $set: { likeCount: updatedLikeCount },
        $pull: { likedBy: userId },
      });

      return { likeCount: updatedLikeCount };
    } else {
      return { likeCount: commentOrReply.likeCount }; // Return existing like count if not liked
    }
  },
  'comments.getLikeStatus': function (commentId, replyId) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('401', 'Not authorized');
    }

    const query = replyId ? { /* query for reply */ } : { _id: commentId };

    const commentOrReply = CommentsCollection.findOne(query);
    if (!commentOrReply) {
      throw new Meteor.Error('404', 'Comment or reply not found');
    }

    const hasLiked = commentOrReply.likedBy && commentOrReply.likedBy.includes(userId);

    return {
      likeCount: commentOrReply.likeCount || 0,
      hasLiked,
    };
  },
  'comments.getComment': function (commentId) {
    return CommentsCollection.findOne({ _id: commentId });
  },
  'posts.love': function (postId, userId) {
    check(postId, String);
    check(userId, String);

    const post = PostsCollection.findOne(postId);

    if (!post) {
      throw new Meteor.Error('404', 'Post not found.');
    }

    // Assuming "lovedBy" is an array in your Posts document
    let isLoved = false;
    let loveCount = 0;

    if (Array.isArray(post.lovedBy)) {
      isLoved = post.lovedBy.includes(userId);
      loveCount = post.lovedBy.length;
    }

    if (isLoved) {
      // If user already loves the post, remove their userId
      PostsCollection.update(postId, {
        $pull: { lovedBy: userId },
      });
    } else {
      // If user doesn't love the post yet, add their userId
      PostsCollection.update(postId, {
        $addToSet: { lovedBy: userId },
      });
    }

    // Re-fetch post to get updated count
    const updatedPost = PostsCollection.findOne(postId);
    loveCount = updatedPost.lovedBy ? updatedPost.lovedBy.length : 0;
    isLoved = updatedPost.lovedBy.includes(userId);

    return { isLoved, loveCount };
  },

  'comments.delete' (commentId) {
    check(commentId, String);

    // Perform authorization checks here if needed

    // Delete comment from database
    const deleted = CommentsCollection.remove({ _id: commentId });

    if (!deleted) {
      throw new Meteor.Error('comment.delete.failed', 'Failed to delete comment');
    }
    return deleted;
  },

  'comments.edit' (commentId, newContent) {
    check(commentId, String);
    check(newContent, String);

    // Perform authorization checks here if needed

    // Edit the comment in the database
    const edited = CommentsCollection.update(
      { _id: commentId },
      { $set: { content: newContent } },
    );

    if (!edited) {
      throw new Meteor.Error('comment.edit.failed', 'Failed to edit comment');
    }
    return edited;
  },
   'getPostCountByCategory': function(categoryName) {
    // Validate input
    check(categoryName, String);

    // Check user authentication or role-based permissions
    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    // Actual logic to get post count
    try {
      const count = PostsCollection.find({ category: categoryName }).count();
      return count;
    } catch (e) {
      // Log the error to a server-side logging service
      // Log.error('Error in getPostCountByCategory', e);

      throw new Meteor.Error(500, 'Internal Server Error');
    }
  },
    'posts.getAllPostIds': function(options = { limit: 50, page: 1 }) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to get post IDs.');
    }

    // Validate options with 'check' if necessary
    check(options, {
      limit: Number,
      page: Number,
    });

    const skipOptions = { skip: (options.page - 1) * options.limit, limit: options.limit };
    
    try {
      // Fetch an array of post IDs with pagination
      const postIds = PostsCollection.find({}, { fields: { _id: 1 }, ...skipOptions })
        .map(post => post._id);
      
      return postIds;
    } catch (error) {
      // Log the error and throw a new Meteor error to the client
     // console.error('Error fetching post IDs:', error);
      throw new Meteor.Error('server-error', 'Error fetching post IDs');
    }
  },
     'posts.incrementShareCount'(postId) {
    check(postId, String); 
    if (!postId) {
      // Handle the error or return a default value
      throw new Meteor.Error('invalid-argument', 'postId is required');
    }
    check(postId, String);
  },
  'posts.incrementShareCount': async function (postId) {
    check(postId, String);

    const post = PostsCollection.findOneAsync(postId);
    if (!post) {
      throw new Meteor.Error('not-found', 'Post not found');
    }

    PostsCollection.updateAsync(postId, {
      $inc: { shareCount: 1 },
    });
  },
  'posts.getShareCount'(postId) {
    // Assuming you have a Posts collection where each post has a shareCount field
    const post = PostsCollection.findOneAsync(postId);
    if (!post) {
      throw new Meteor.Error('post-not-found', 'Post not found');
    }
    return post.shareCount || 0;
  },
});

// You can further break down other methods into their respective modules.
