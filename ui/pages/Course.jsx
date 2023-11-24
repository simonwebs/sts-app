import React, { lazy } from 'react';

const VideoPlayer = lazy(() => import('../components/VideoPlayer'));

const Course = () => {
  const videoUrl = 'https://res.cloudinary.com/swed-dev/video/upload/v1686910934/upg9q7q9bcaize36dd7r.mp4'; // Replace with your video URL

  return (
    <div className="container mx-auto mt-8 py-12 px-8 h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Column */}
        <div className="col-span-2">
          <div className="p-4 bg-white shadow-md">
            <VideoPlayer videoUrl={videoUrl} />
            <h6 className="text-lg font-semibold mt-4">Video Transcript</h6>
            <p className="mt-2">
              {/* Transcript content here */}
            </p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Like <div className="ml-1 inline-block" />
            </button>
          </div>
        </div>

        {/* Modules Column */}
        <div className="col-span-1">
          <div className="p-4 bg-white shadow-md">
            <h6 className="text-lg font-semibold">Modules</h6>
            <ul className="mt-3 space-y-2">
              {/* Replace with your module/lesson list */}
              <li>Module 1: Introduction</li>
              <li>Module 2: Getting Started</li>
              <li>Module 3: Advanced Techniques</li>
              {/* ... */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Course;
