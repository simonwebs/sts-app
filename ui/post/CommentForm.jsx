import React, { useState, useRef, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Image } from 'cloudinary-react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { FaPaperPlane } from 'react-icons/fa';

const CommentForm = ({ postId, parentId }) => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, []);

  const handleAddComment = (event) => {
    event.preventDefault();
    setSubmitting(true);
    const authorId = Meteor.userId();

    if (!postId || typeof postId !== 'string') {
      console.error('Invalid postId. Make sure it is a non-null string.');
      return;
    }

    if (!authorId || typeof authorId !== 'string') {
      console.error('Invalid authorId. Make sure it is a non-null string.');
      return;
    }

    const commentData = {
      postId,
      authorId,
      content: comment,
      parentId,
    };

    Meteor.call('comments.add', { postId, authorId, content: comment, parentId }, (err, res) => {
      if (err) {
        console.error('Error adding comment:', err);
      } else {
        console.log('Comment added:', res);
        setComment('');
        resizeTextarea();
      }
      setSubmitting(false);
    });
  };

  const handleTextareaChange = (e) => {
    setComment(e.target.value);
    setIsTyping(e.target.value !== '');
    resizeTextarea();
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      // Do nothing or insert a line break depending on your requirements
    }
  };
  const placeholderText = `Type here to add a comment as ${loggedUser?.username || 'User'}...`;

  const profileImageId = loggedUser?.newImage || loggedUser?.profile?.image || 'https://res.cloudinary.com/swed-dev/image/upload/v1682096284/os4x2bkvdei87o1intpf.webp';
  const cloud_name = 'cedar-christian-bilingual-school';

  if (isLoadingLoggedUser) {
    return <p>Loading...</p>;
  }
  if (isLoadingLoggedUser) {
    return <div className="flex justify-center items-center">
        <ClipLoader size={25} color={'#4C3BAB'} />
      </div>;
  }
  return (
    <div className="flex items-start space-x-4">
      {isTyping && (
        <div className="flex-shrink-0">
         <Image
  cloud_name={cloud_name}
  publicId={profileImageId}
  width="32"
  height="32"
  crop="fill"
  quality="auto"
  fetchFormat="auto"
  secure
  dpr="auto"
  className="inline-block h-8 w-8 rounded-full"
  alt="User profile"
/>
        </div>
      )}
      <form action="#" onSubmit={(e) => handleAddComment(e)} className="flex items-center">
        <div className={`border-b ${isTyping ? 'border-indigo-600' : 'border-gray-200'} focus-within:border-indigo-600 flex-1`}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={comment}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress} // Add this line
            className="w-full resize-none border-0 p-2 pb-1 text-gray-900 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:ring-0 sm:text-sm sm:leading-6"
            placeholder={placeholderText}
          />
        </div>
        <div className="flex-shrink-0 pl-2">
          <button
            type="submit"
            disabled={submitting}
            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${isTyping ? 'bg-transparent text-primary' : 'bg-transparent text-black'} hover:bg-transparent focus:outline-none`}
          >
            {submitting ? 'Submitting...' : <FaPaperPlane className="w-4 h-4 hover:w-5 hover:h-5 text-primary dark:text-gray-200" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
