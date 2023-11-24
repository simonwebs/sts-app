import React from 'react';
//import { useTracker } from 'meteor/react-meteor-data';
import VideoCommentForm from './VideoCommentForm';
import NestedComment from './NestedComment'; // Reuse this component, as it should be the same
//import { FaComment, FaHeart, FaShare } from 'react-icons/fa';
// ... other imports

const VideoCommentBox = ({ postId }) => {
  // ... existing logic and states
  return (
    <>
      {/* ... existing UI */}
      <div className="border border-gray-300 p-4 rounded-md dark:bg-gray-700 bg-white text-gray-700 dark:text-white">
        {currentComments.map((comment) => (
          <NestedComment key={comment._id} comment={comment} postId={postId} />
        ))}
        <VideoCommentForm postId={postId} />
        {/* ... existing pagination logic */}
      </div>
    </>
  );
};

export default VideoCommentBox;
