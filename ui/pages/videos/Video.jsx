import React, { lazy } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { VideosCollection } from '../../../api/collections/VideosCollection';
import { Meteor } from 'meteor/meteor';
import ClipLoader from 'react-spinners/ClipLoader';

const VideoCard = lazy(() => import('./VideoCard')); // Replace PostCard with VideoCard

const Video = () => {
  const { videos, isLoading } = useTracker(() => {
    const videosSubscription = Meteor.subscribe('videosWithAuthors'); // Make sure you have a videosWithAuthors subscription

    if (!videosSubscription.ready()) {
      return { videos: [], isLoading: true };
    }

    const videos = VideosCollection.find({}, { sort: { createdAt: -1 } }).fetch();
    return { videos, isLoading: false };
  });

  if (isLoading) {
    return <div><ClipLoader size={25} color={'#4C3BAB'} /></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {videos?.map(video => <VideoCard key={video._id} video={video} />)}
    </div>
  );
};

export default Video;
