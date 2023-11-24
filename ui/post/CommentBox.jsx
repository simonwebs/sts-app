import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CommentsCollection } from '../../api/collections/CommentsCollection';
import { PostsCollection } from '../../api/collections/posts.collection'; // Import PostsCollection
import { Meteor } from 'meteor/meteor';
import CommentForm from './CommentForm';
import NestedComment from './NestedComment';
import ShareButton from './ShareButton';
import { FaComment, FaHeart, FaShare } from 'react-icons/fa';

const CommentBox = ({ postId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);

  const [isLoved, setIsLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(0);
  

  const { post, comments, isLoading } = useTracker(() => {
    const handleComments = Meteor.subscribe('commentsForPost', postId);
    const handlePost = Meteor.subscribe('singlePost', postId);

    const post = PostsCollection.findOne(postId);
    const rawComments = CommentsCollection.find({ postId, parentId: { $exists: false } }).fetch();

    const commentsWithAuthor = rawComments.map(comment => {
      const author = Meteor.users.findOne({ _id: comment.authorId });
      return {
        ...comment,
        authorUsername: author?.username,
        authorImage: author?.profile?.image,
      };
    });

    return {
      post,
      comments: commentsWithAuthor,
      isLoading: !handleComments.ready() || !handlePost.ready(),
    };
  });
  useEffect(() => {
    if (post && post.lovedBy) { // Add this check
      const isLoved = post.lovedBy.includes(Meteor.userId());
      const loveCount = post.lovedBy.length;

      setIsLoved(isLoved);
      setLoveCount(loveCount);
    }
  }, [post]);

  const sortedComments = [...comments].sort((a, b) => b._id.localeCompare(a._id));
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

  const handleLoveClick = () => {
    Meteor.call('posts.love', postId, Meteor.userId(), (error, result) => {
      if (error) {
        console.error(`Could not toggle love for post: ${error}`);
      } else {
        setIsLoved(result.isLoved);
        setLoveCount(result.loveCount);
      }
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="flex justify-between p-2 items-center bg-white text-gray-700 dark:bg-gray-700 dark:text-white mb-3 shadow-md">
        <button
  onClick={handleLoveClick}
  className={`text-lg ${isLoved ? 'text-red-500 font-normal dark:text-gray-300 text-lg' : 'text-lg text-gray-700 dark:text-gray-300'}`}>
  <FaHeart />
  <span>{loveCount || '0'} Love</span>
</button>

        <button className="flex items-center">
          <FaComment />
          <span>{comments.length} Comments</span>
        </button>
        <div className="flex items-center">
          <ShareButton postId={post._id} postCaption={post.caption} postImage={post.image} />
        </div>
      </div>
      {isLoading
        ? (
        <div className="italic dark:bg-gray-800 bg-white text-gray-700 dark:text-white">
          Loading...
        </div>
          )
        : (
        <div className="border border-gray-300 p-4 rounded-md dark:bg-gray-700 bg-white text-gray-700 dark:text-white">
          {currentComments.map((comment) => (
            <NestedComment key={comment._id} comment={comment} postId={postId} />
          ))}
          <CommentForm postId={postId} />
          <div className="flex justify-center mt-2 dark:bg-gray-700/100">
            <div className="pagination flex justify-center mt-2">
              {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 py-2 px-4 rounded-md text-white ${currentPage === index + 1 ? 'bg-cyan-600' : 'bg-cyan-400'} hover:bg-cyan-500 focus:outline-none focus:ring focus:ring-cyan-200`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
          )}
    </>
  );
};

export default CommentBox;
