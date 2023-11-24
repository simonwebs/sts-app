import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

const LovePostButton = ({ handleLovePost, post }) => {
  return (
    <button onClick={() => handleLovePost(post?._id)} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
      <HeartIcon className="w-6 h-6" />
      <span className='text-primary dark:text-white font-semibold'>{post?.loves?.length}</span>
    </button>
  );
};
export default LovePostButton;
