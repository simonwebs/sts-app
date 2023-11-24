import React, { useState, useEffect } from 'react';
//import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
//import CommentForm from './CommentForm';
import { Image } from 'cloudinary-react';
// import Swal from 'sweetalert2';
// import LikeButton from './LikeButton';
// import TimeSince from '../components/TimeSince';
// import { FaComment } from 'react-icons/fa';
// import { VscEllipsis } from 'react-icons/vsc';

const NestedComment = ({ comment, postId, level = 0, replyIndex }) => {
  const cloud_name = 'swed-dev';
//  const [replies, setReplies] = useState([]);
  const [showRepliesAndForm, setShowRepliesAndForm] = useState(false);

  const fetchReplies = () => {
    // Fetch replies code here...
  };

  useEffect(() => {
    const computation = Tracker.autorun(() => {
      fetchReplies();
    });

    return () => {
      computation.stop();
    };
  }, [comment._id]);

  //const toggleRepliesAndForm = () => {
   
  
  ///setShowRepliesAndForm(!showRepliesAndForm);
 // };

  // The rest of the logic here...

  const renderCommentContent = () => {
    if (comment.type === 'video') {
      return <video width="320" height="240" controls>
        <source src={comment.contentUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>;
    } else {
      return <p>{comment.content}</p>;
    }
  };

  return (
    <div className="space-y-4 dark:bg-gray-700/100 p-2" style={{ marginLeft: `${level * 20}px` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            cloud_name={cloud_name}
            publicId={comment?.authorImage}
            width="80"
            height="80"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 font-semibold">{comment.authorUsername}</span>
        </div>
        
        {/* Comment Content */}
        {renderCommentContent()}

        {/* More existing code here... */}
      </div>
      {/* ... */}
    </div>
  );
};

export default NestedComment;
