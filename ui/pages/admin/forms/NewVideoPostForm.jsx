import React, { useState, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import JoditEditor from 'jodit-react';
import { FaVideo } from 'react-icons/fa';


const NewVideoPostForm = ({ showModal, setShowModal }) => {
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [platform, setPlatform] = useState('');
 const handleVideoPostSubmit = useCallback((event) => {
  event.preventDefault();

  // Removing <p> tags from content
  const strippedContent = content.replace(/<\/?p>/g, '');

  if (!title || !strippedContent || !category || !platform) {
    Swal.fire('Oops...', 'Please fill all required fields!', 'error');
    return;
  }

  const currentUser = Meteor.user();
  if (!currentUser) {
    Swal.fire('Oops...', 'You are not authenticated!', 'error');
    return;
  }

  const authorId = currentUser._id;
  const data = {
    authorId,
    title,
    content: strippedContent,
    url,
    category,
    platform,
  };

  console.log('Data to be sent:', data); 
setProgress(50); // 50% for example, indicating the request is being processed

Meteor.call('videos.create', data, (err, postId) => {
  setProgress(100); // 100%, indicating the request is complete

  if (err) {
    Swal.fire('Oops...', 'Something went wrong!', 'error');
  } else {
    Swal.fire('Success!', 'Your video post has been created.', 'success');
    setTitle('');
    setContent('');
    setUrl('');
    setCategory('');
    setPlatform('');
    setShowModal(false);
  }
  setProgress(0); // Resetting progress
});
}, [title, content, url, category, platform]);

  return (
     <div className={`fixed inset-0 bg-black bg-opacity-50 z-999 py-12 px-8 ${showModal ? 'block' : 'hidden'}`}>
      <div className="relative">
        <div className="absolute top-0 left-0 h-1" style={{ width: `${progress}%`, backgroundColor: 'blue' }}></div>
      </div>
      <div className="fixed inset-0" onClick={() => setShowModal(false)}></div>
      <div className="relative p-6 bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 mt-10 overflow-hidden">
        <button className="absolute top-4 right-4 text-gray-700" onClick={() => setShowModal(false)}>
          X
        </button>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <form onSubmit={handleVideoPostSubmit} className="mt-4">
          <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="" disabled>Select Category</option>
        <option value="health">Health</option>
        <option value="gospel">Gospel</option>
        <option value="prophecy">Prophecy</option>
          <option value="social">Social</option>
        {/* Add more categories as needed */}
      </select>
      <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="" disabled>Select Platform</option>
          <option value="youtube">YouTube</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
        </select>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded mb-4"
            />
            <JoditEditor
              value={content}
              config={{ readonly: false }}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
            />
            <label className="block w-full p-2 border border-gray-300 rounded mb-4 cursor-pointer text-center">
              <FaVideo size={24} />
              <input
                type="text"
                placeholder="Video Link (YouTube, Social Media, etc.)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded mb-4"
              />
            </label>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary dark:bg-green-500 text-white rounded"
            >
              Create Video Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewVideoPostForm;
