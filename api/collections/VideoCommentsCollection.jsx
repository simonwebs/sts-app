import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const VideoCommentsCollection = new Mongo.Collection('videoComments');

const VideoCommentsSchema = new SimpleSchema({
  _id: String,
  videoId: String,  // Reference to the video
  authorId: String,  // Reference to the author
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
  content: String,  // The content of the comment
  likes: {  // Users who liked this comment
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'likes.$': String,
});

VideoCommentsCollection.attachSchema(VideoCommentsSchema);
