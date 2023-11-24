import { Meteor } from 'meteor/meteor';
import { VideosCollection } from '../collections/VideosCollection';
import { VideoCommentsCollection } from '../collections/VideoCommentsCollection';

Meteor.methods({
  'videos.create'(video) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }
    
    VideosCollection.insert({
      _id: new Meteor.Collection.ObjectID().toHexString(),
      authorId: userId,
      createdAt: new Date(),
      viewCount: 0,
      url: video.url,
      category: video.category,
      platform: video.platform,
      title: video.title,
      content: video.content,
      loves: [],
      lovedBy: [],
    });
  },
    'videoComments.create'(comment) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    VideoCommentsCollection.insert({
      _id: new Meteor.Collection.ObjectID().toHexString(),
      videoId: comment.videoId,
      authorId: userId,
      createdAt: new Date(),
      content: comment.content,
      likes: [],
    });
  },
  
  'videoComments.like'(commentId) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    VideoCommentsCollection.update(commentId, {
      $addToSet: { likes: userId },
    });
  },
    'videos.like'(videoId) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('Not authorized.');
    }

    VideosCollection.update(videoId, {
      $addToSet: { loves: userId },
      $inc: { viewCount: 1 }
    });
  },
  
  'videos.share'(videoId) {
    // Your logic for sharing the video
  },
});
