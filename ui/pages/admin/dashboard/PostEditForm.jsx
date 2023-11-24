import React, { useState } from 'react';

const PostEditForm = ({ post, onUpdate, onClose }) => {
  const [updatedPost, setUpdatedPost] = useState(post);

  const handleUpdate = () => {
    onUpdate(updatedPost);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <button onClick={onClose} className="float-right text-gray-700 hover:text-gray-900">&times;</button>
        <div className="mb-4">
          <label htmlFor="caption" className="block text-gray-700 text-sm font-bold mb-2">Caption</label>
          <input type="text" id="caption" value={updatedPost.caption} onChange={(e) => setUpdatedPost({ ...updatedPost, caption: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea id="description" value={updatedPost.description} onChange={(e) => setUpdatedPost({ ...updatedPost, description: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"></textarea>
        </div>
        <div className="flex justify-end">
          <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PostEditForm;
