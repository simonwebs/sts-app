import { Meteor } from 'meteor/meteor';
import { VideosCollection } from '../collections/VideosCollection';

// Publish a single video and its author's details
Meteor.publish('videoAndAuthor', function (videoId) {
  return [
    VideosCollection.find({ _id: videoId }),
    Meteor.users.find({ _id: { $in: VideosCollection.find({ _id: videoId }).map((video) => video.authorId) } }, { fields: { username: 1, 'profile.image': 1 } })
  ];
});

Meteor.publish('videos.all', function () {
  const videos = VideosCollection.find({}, {
    fields: {
      _id: 1,
      authorId: 1,
      createdAt: 1,
      viewCount: 1,
      url: 1,
      category: 1,
      platform: 1,
      title: 1,
      content: 1,
      loves: 1,
      lovedBy: 1
    }
  });
  return videos;
});
