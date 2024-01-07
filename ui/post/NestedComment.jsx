import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import CommentForm from './CommentForm';
import { Image } from 'cloudinary-react';
import Swal from 'sweetalert2';
import LikeButton from './LikeButton';
import TimeSince from '../components/TimeSince';
import { FaComment } from 'react-icons/fa';
import { VscEllipsis } from 'react-icons/vsc';

const NestedComment = ({ comment, postId, level = 0, replyIndex }) => {
  const cloudName = 'techpulse';
  const [replies, setReplies] = useState([]);
  const [showRepliesAndForm, setShowRepliesAndForm] = useState(false);

  const fetchReplies = () => {
    Meteor.call('comments.getReplies', comment._id, (error, result) => {
      if (error) {
        console.error('Error fetching replies:', error);
      } else {
        setReplies(result);
      }
    });
  };

  useEffect(() => {
    const computation = Tracker.autorun(() => {
      fetchReplies();
    });
    return () => {
      computation.stop();
    };
  }, [comment._id]);

  const toggleRepliesAndForm = () => {
    setShowRepliesAndForm(!showRepliesAndForm);
  };

  const handleDelete = (commentId) => {
    Meteor.call('comments.delete', commentId, (error, result) => {
      if (error) {
        console.error('Error deleting comment:', error);
      } else {
        fetchReplies();
      }
    });
  };
  const handleEdit = (commentId, newContent) => {
    Meteor.call('comments.edit', commentId, newContent, (error, result) => {
      if (error) {
        console.error('Error editing comment:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Could not edit comment.',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Success!',
          text: 'Comment edited successfully.',
          icon: 'success',
        });
        fetchReplies();
      }
    });
  };

  const showOptions = (commentId) => {
    Swal.fire({
      title: 'Choose an action',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Edit',
      denyButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enter new content',
          input: 'text',
          inputPlaceholder: 'New content',
        }).then((newContent) => {
          if (newContent.isConfirmed) {
            handleEdit(commentId, newContent.value);
          }
        });
      } else if (result.isDenied) {
        handleDelete(commentId);
      }
    });
  };

  return (
    <div className="space-y-4 dark:bg-gray-700/100 p-2" style={{ marginLeft: `${level * 20}px` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            cloudName={cloudName}
            publicId={comment?.authorImage}
            width="80"
            height="80"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 font-semibold">{comment.authorUsername}</span>
        </div>
        <VscEllipsis onClick={() => showOptions(comment._id)} className="cursor-pointer text-lg text-gray-700 dark:text-gray-400 font-semibold" />
      </div>

      <div className="ml-10">
        <div className="whitespace-normal">
          {comment.content || comment.text}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className='text-lg text-gray-700 dark:text-gray-400'>
              <TimeSince date={comment.createdAt} />
            </span>
            <LikeButton commentId={comment._id} replyIndex={replyIndex} />
            <button onClick={toggleRepliesAndForm} className="text-md text-gray-700 dark:text-gray-400">
              Reply
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <FaComment className="mr-1" />
            <span>{replies.length}</span>
          </div>
        </div>
      {showRepliesAndForm && (
        <div className="shadow-sm overflow-y-auto" style={{ maxHeight: replies.length >= 5 ? '200px' : 'auto' }}>
          {replies?.reverse().map((reply) => (
            <div key={reply._id}>
              <NestedComment comment={reply} postId={postId} level={level + 1} />
            </div>
          ))}
          <CommentForm postId={postId} parentId={comment._id} onCommentAdded={fetchReplies} />
        </div>
      )}
    </div>
  </div>
  );
};
export default NestedComment;
