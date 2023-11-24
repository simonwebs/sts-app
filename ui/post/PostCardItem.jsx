import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PaperAirplaneIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon, ShareIcon, BookOpenIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import EmojiPicker from 'emoji-picker-react';
import { Image } from 'cloudinary-react';

const PostCardItem = ({ post }) => {
  const [currentComment, setCurrentComment] = useState('');
  const [comments, setComments] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { author, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('postsWithAuthors', post._id);

    const author = post ? Meteor.users.findOne(post.authorId) : null;

    return {
      author,
      isLoading: !handle.ready(),
    };
  }, [post._id]);

  const currentUser = useTracker(() => {
    Meteor.subscribe('allUsers');
    return Meteor.users.findOne({ _id: Meteor.userId() });
  }, []);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!currentUser);

  const profileImageId = author?.newImage || author?.profile?.image;
  const cloudName = 'swed-dev';

  useEffect(() => {
    Meteor.call('posts.getPost', post._id, (error, fetchedPost) => {
      if (error) {
        console.error(error);
      } else {
      // For each comment, fetch the author data
        const fetchedComments = fetchedPost?.comments || [];
        const updatedComments = fetchedComments.map(comment => {
          const commentAuthor = Meteor.users.findOne(comment?.userId);
          return {
            ...comment,
            username: commentAuthor?.username,
            profileImageId: commentAuthor?.newImage || commentAuthor?.profile?.image,
          };
        });
        setComments(updatedComments);
      }
    });

    setIsUserLoggedIn(!!currentUser);
  }, [post._id, forceUpdate, currentUser]);

  const handleInput = (e) => {
    setCurrentComment(e.target.value);
    // console.log(e.target.value); // Add this line
  };
  const handleSend = (postId) => {
    // console.log('Post object: ', post);

    const trimmedComment = currentComment.trim();

    if (currentUser && 'username' in currentUser && 'profile' in currentUser && trimmedComment) {
      const newComment = {
        text: trimmedComment,
        username: currentUser.username,
        profileImageId: currentUser.newImage || currentUser.profile.image,
      };

      Meteor.call('posts.addComment', postId, trimmedComment, (error, newCommentId) => {
        if (error) {
          // console.error(error);
        } else {
          newComment._id = newCommentId;
          setComments((prevComments) => [...prevComments, newComment]);
          setCurrentComment('');
        }
      });
    } else {
      if (!currentUser) {
        // console.error('User must be logged in to comment.');
      } else if (!trimmedComment) {
        // console.error("Comment can't be empty.");
      } else {
        // console.error('User must have a username and profile image.');
      }
    }
  };
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // @ts-ignore
      handleSend(post._id, currentComment.trim());
    } else if (event.key === ' ') {
      event.stopPropagation();
    }
  };

  const handleLovePost = (postId) => {
    Meteor.call('posts.love', postId, currentUser, (error) => {
      if (error) {
        // console.error(error);
      } else {
        setForceUpdate(!forceUpdate);
      }
    });
  };

  const handleSharePost = async (post) => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    const shareText = `${post.caption}\n\n${post.description}\n\nRead more at: ${postUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          text: shareText,
          url: postUrl,
        });
        // console.log('Post shared successfully');
      } catch (err) {
        // console.error('Error sharing post', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        // console.log('Link to post copied to clipboard');
      } catch (err) {
        // console.error('Error copying link to clipboard', err);
      }
    }
  };
  // eslint-disable-next-line no-unused-vars
  function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const onEmojiClick = (_, emojiObject) => {
    setCurrentComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow-md rounded-md p-6 space-y-2">
      <div className="flex items-center space-x-2">
        {profileImageId
          ? (profileImageId.startsWith('data:')
              ? <img
                src={profileImageId}
                className="w-12 h-12 rounded-full border-2 border-gray-300"
                alt="Author"
              />
              : <Image
                cloudName={cloudName}
                publicId={profileImageId}
                width="auto"
                crop="scale"
                quality="auto"
                fetchFormat="auto"
                secure
                dpr="auto"
                responsive
                className="w-12 h-12 rounded-full border-2 border-gray-300"
                alt="Author"
              />
            )
          : <p>No profile image</p>
        }
        <div>
          <h2 className="font-semibold text-lg dark:text-gray-300">{author?.username || 'Username'}</h2>
          <span className="text-gray-800 text-sm dark:text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <Link to={`/post/${post._id}`} key={post._id}>
        <h3 className="truncate ml-14 font-semibold dark:text-white text-lg">{post?.caption?.charAt(0).toUpperCase() + post?.caption?.slice(1)}</h3>
        {post?.image && (
          <LazyLoadImage
            src={post?.image}
            alt="Post"
            className="h-full w-full object-cover object-center group-hover:opacity-75 rounded-md"
          />
        )}
      </Link>

      <div>
        <p className="dark:text-white text-gray-600">
          {isExpanded
            ? post?.description?.charAt(0).toUpperCase() + post?.description?.slice(1)
            : post?.description?.charAt(0).toUpperCase() + post?.description?.slice(1, 100) + '...'}
        </p>
        <button onClick={handleExpandClick} className="flex items-center">
          {isExpanded
            ? (
                <>
                  <XMarkIcon className="h-6 w-6 text-lg text-primary dark:text-white" />
                  <span className="ml-2 dark:text-cyan-400 font-bold">Close</span>
                </>
              )
            : (
                <>
                  <BookOpenIcon className="h-6 w-6 text-lg text-primary dark:text-white" />
                  <span className="ml-2 dark:text-cyan-400 font-bold">Continue reading</span>
                </>
              )
          }
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => handleLovePost(post._id)} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
          <HeartIcon className="w-6 h-6"/>
          <span className='text-primary dark:text-white font-semibold'>{post.loves?.length || 0}</span>
        </button>

        <button onClick={() => handleSharePost(post)} className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
          <ShareIcon className="w-6 h-6"/>
          <span className='text-primary dark:text-white font-semibold'>{post?.shares || 0}</span>
        </button>

        <button onClick={toggleComments} className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>
          <span className='text-primary dark:text-white font-semibold'>{comments.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div style={{ maxHeight: '20rem', overflowY: 'auto' }}>
          {comments?.map((comment) => (
            <div key={comment._id}>
              <div className="flex items-center space-x-2">
                {comment.profileImageId
                  ? (comment.profileImageId.startsWith('data:')
                      ? <img
                          src={comment.profileImageId}
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          alt="Comment Author"
                        />
                      : <Image
                          cloudName={cloudName}
                          publicId={comment.profileImageId}
                          width="auto"
                          crop="scale"
                          quality="auto"
                          fetchFormat="auto"
                          secure
                          dpr="auto"
                          responsive
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          alt="Comment Author"
                        />
                    )
                  : <p>No profile image</p>
                }
                <h2 className="font-semibold dark:text-white text-lg">{comment.username || 'Username'}</h2>
              </div>
              <p className='dark:text-white ml-10 text-md'>{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      <form className='relative flex items-center transition-all duration-200 ease-in-out w-full'>
        {isUserLoggedIn
          ? (
            <textarea
              rows="1"
              value={currentComment}
              onChange={handleInput}
              onKeyDown={handleKeyPress}
              className='w-full py-2 px-3 md:py-2 shadow-md md:px-3 lg:py-3 lg:px-4 rounded-2xl resize-none dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 bg-gray-100 border-transparent focus:ring-0 focus:border-transparent mb-1'
              placeholder="Type here..."
              style={{ overflow: 'hidden', paddingRight: '40px' }}
            />
            )
          : <p>Please log in to comment.</p>
        }

        <button
          className='rounded-full bg-gray-300 p-1.5 text-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleSend(post._id);
          }}
        >
          <PaperAirplaneIcon className="h-5 w-5 text-gray-700" />
        </button>
      </form>

      {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
    </div>
  );
};

export default PostCardItem;
