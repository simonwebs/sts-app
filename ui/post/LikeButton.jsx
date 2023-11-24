import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import icons

const LikeButton = ({ commentId, replyId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    Meteor.call('comments.getLikeStatus', commentId, replyId, (error, result) => {
      if (error) {
        console.error('Could not fetch like status:', error);
      } else {
        if (result) {
          setLikeCount(result.likeCount);
          setHasLiked(result.hasLiked);
        }
      }
    });
  }, [commentId, replyId]);

  const handleLike = () => {
    const action = hasLiked ? 'unlike' : 'like';

    Meteor.call(`comments.${action}`, commentId, replyId, (error, result) => {
      if (error) {
        console.error(`Could not ${action}:`, error);
      } else {
        if (result && result.likeCount !== undefined) {
          setLikeCount(result.likeCount);
          setHasLiked(!hasLiked);
        }
      }
    });
  };

  return (
    <div className="flex justify-between items-center">
      <button 
        onClick={handleLike} 
        className={`flex items-center ${hasLiked ? 'text-blue-500' : 'text-gray-500'}`}
      >
        {hasLiked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
        <span className="text-gray-600 dark:text-gray-300">
        {likeCount} Like | 
      </span>
      </button>
    </div>
  );
};

export default LikeButton;
