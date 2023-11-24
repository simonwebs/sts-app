import React, { lazy, Suspense } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { VideosCollection } from '../../../api/collections/VideosCollection';
import ClipLoader from 'react-spinners/ClipLoader';

const VideoCardItem = lazy(() => import('./VideoCardItem'));

const VideoCard = () => {
  const { videos, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('videosWithAuthors');

    if (!handle.ready()) {
      return { videos: [], isLoading: true };
    }

    const videos = VideosCollection.find({}, { sort: { createdAt: -1 } }).fetch().map(video => {
      const author = Meteor.users.findOne(video.authorId);
      return { ...video, author };
    });

    return { videos, isLoading: false };
  });

  if (isLoading) {
    return (
      <div>
        <ClipLoader size={25} color={'#4C3BAB'} />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4">
      <Suspense fallback={<ClipLoader size={25} color={'#4C3BAB'} />}>
        {videos?.map((video) => {
          if (!video?.author) {
            return null;
          }

          return (
            <VideoCardItem key={video._id} video={video} author={video.author} />
          );
        })}
      </Suspense>
    </div>
  );
};

export default VideoCard;
