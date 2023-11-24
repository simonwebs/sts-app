import React from 'react';

const PostItem = ({
  post,
  showPaperIcon,
  setShowPaperIcon,
  currentComment,
  setCurrentComment,
  inputFocused,
  setInputFocused,
}) => {
  // Comment-related code goes here...
  const handleComment = () => {
    // Implement comment handling logic here...
  };

  return (
    <div key={post._id}>
      <div className='post-card'>
        <div className='flex items-start space-x-2'>
          {/* Author information */}
          <div>{post.author}</div>
        </div>
        {/* Post content */}
        <div>{post.content}</div>
        {/* Comment section */}
        <div>
          <button onClick={handleComment}>Comment</button>
          {showPaperIcon && <div>{currentComment}</div>}
        </div>
      </div>
    </div>
  );
};
export default PostItem;
