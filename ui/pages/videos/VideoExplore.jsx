import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import TimeSince from '../../components/TimeSince';
import AuthorProfileImage from '../AuthorProfileImage';
import { VideosCollection } from '../../../api/collections/VideosCollection';
import VideoPlayer from '../../components/VideoPlayer';

const VideoExplore = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cloud_name = 'swed-dev';
  const { videos, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('videos.all');
    const videos = VideosCollection.find({}).fetch().map((video) => {
      const author = Meteor.users.findOne(video.authorId);
      return {
        ...video,
        author
      };
    });
  
    return {
      videos,
      isLoading: !subscription.ready(),
    };
  }, []);

  const videosPerPage = 6;
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (isLoading) {
    return <ClipLoader />;
  }

  return (
    <div className="bg-white dark:bg-gray-700 py-24 sm:py-32">
      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
      {currentVideos.map((video, index) => (
  <article key={video._id} className="flex flex-col items-start justify-between block">
    <div className="p-4 border rounded">
      <div>
   <VideoPlayer videoSrc={video.url} />

      </div>

              <div className="mt-4">
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <span className="text-lg text-gray-700 dark:text-gray-400">
                      <TimeSince date={video.createdAt} />
                    </span>
                    <Link
                      className="relative z-10 rounded-full bg-gray-300 dark:bg-gray-600 dark:text-gray-300 px-3 py-1.5 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 hover:text-gray-500"
                    >
                      {video.category} {/* Assuming you have category in your video object */}
                    </Link>
                  </div>
                  <div className="group relative mt-3">
                    <h3 id='line-clamp-2' className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-gray-300">
                      <Link to={`/video/${video._id}`}>
                        <span className="absolute inset-0" />
                        {video.title}
                      </Link>
                    </h3>
                    <p id='line-clamp-2' className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {video.content} 
                    </p>
                  </div>
                </div>
               <div className="relative mt-8 flex items-center gap-x-4">
                  <AuthorProfileImage
                    cloud_name={cloud_name}
                    authorImage={video.author?.profile?.image}
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <Link to={`/profile/${video.author._id}`}>
                        <span className="absolute inset-0" />
                        {video.author.username}
                      </Link>
                    </p>
                    <p className="text-gray-600">{video.author.profile.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`rounded-lg bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${i + 1 === currentPage ? 'font-semibold' : ''}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
    </div>
  );
};

export default VideoExplore;