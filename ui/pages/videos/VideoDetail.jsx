import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { VideosCollection } from '../../../api/collections/VideosCollection';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import VideoCommentBox from './VideoCommentBox';

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [allVideoIds, setAllVideoIds] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const fetchVideoData = useCallback(() => {
    Meteor.call('videos.getAllVideoIds', (error, result) => {
      if (error) {
        return;
      }
      setAllVideoIds(result);
      setCurrentVideoIndex(result.indexOf(videoId));
    });
  }, [videoId]);

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  const handleNextClick = () => {
    if (currentVideoIndex < allVideoIds.length - 1) {
      navigate(`/videos/${allVideoIds[currentVideoIndex + 1]}`);
    }
  };

  const handlePrevClick = () => {
    if (currentVideoIndex > 0) {
      navigate(`/videos/${allVideoIds[currentVideoIndex - 1]}`);
    }
  };

  const { video, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('videosWithAuthors', videoId);
    const fetchedVideo = VideosCollection.findOne(videoId);
    return {
      video: fetchedVideo,
      isLoading: !handle.ready(),
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found.</div>;
  }

  const videoSource = video.videoUrl;
  const videoComponent = (
    <video width="320" height="240" controls>
      <source src={videoSource} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );

  return (
    <div className="flex items-center justify-center min-h-screen py-6 px-4 md:px-8 lg:px-12 mt-16">
      <div className="container flex flex-col items-center w-full max-w-screen-lg">
        <div className="w-full flex justify-between mb-5">
          <button onClick={handlePrevClick}>
            <FaArrowLeft />
          </button>
          <button onClick={handleNextClick}>
            <FaArrowRight />
          </button>
        </div>
        <div className="w-full cursor-pointer">
          {videoComponent}
        </div>
        <div className="w-full max-w-screen-lg mt-6 bg-white p-6 rounded shadow-md">
          {/* Video Information */}
          <div className="text-sm text-gray-500 flex items-center">
            <time dateTime={video.createdAt}>
              {video.createdAt}
            </time>
            <div>
              <span className="relative rounded-full bg-gray-300 text-gray-600 px-3 py-1.5 font-medium text-gray-400">
                {video.category}
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="ml-4 text-lg">{video.author || 'Unknown Author'}</span>
          </div>
          <h1 className="ml-10 text-2xl font-semibold mt-4">{video.title}</h1>
          <div className="ml-12 mt-2 text-lg leading-relaxed font-medium">
            {video.content}
          </div>
        </div>
        <div className="w-full max-w-screen-lg mt-3 p-4 bg-white rounded shadow-md">
          <VideoCommentBox videoId={video._id} video={video} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
