import React, { useCallback, useEffect, useState, lazy, Suspense, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ClipLoader from 'react-spinners/ClipLoader';
import { Meteor } from 'meteor/meteor';
import { PostsCollection } from '../../api/collections/posts.collection';
import { Image, Transformation } from 'cloudinary-react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import TimeSince from '../components/TimeSince';
import AuthorProfileImage from '../pages/AuthorProfileImage';

const CommentBox = lazy(() => import('./CommentBox'));

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [fullSize, setFullSize] = useState(false);
  const [allPostIds, setAllPostIds] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchPostData = useCallback(() => {
    Meteor.call('posts.getAllPostIds', (error, result) => {
      if (error) {
        return;
      }
      setAllPostIds(result);
      setCurrentPostIndex(result.indexOf(postId));
    });
  }, [postId]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const getNextPostId = useCallback(() => {
    if (currentPostIndex < allPostIds.length - 1) {
      return allPostIds[currentPostIndex + 1];
    }
    return null;
  }, [allPostIds, currentPostIndex]);

  const getPrevPostId = useCallback(() => {
    if (currentPostIndex > 0) {
      return allPostIds[currentPostIndex - 1];
    }
    return null;
  }, [allPostIds, currentPostIndex]);

  const handleNextClick = () => {
    const nextPostId = getNextPostId();
    if (nextPostId) {
      navigate(`/posts/${nextPostId}`);
    }
  };
  const convertDescriptionToHTML = (description) => {
    const escapeHtml = (unsafe) => unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    return escapeHtml(description);
  };

  const handlePrevClick = () => {
    const prevPostId = getPrevPostId();
    if (prevPostId) {
      navigate(`/posts/${prevPostId}`);
    }
  };

  const handleFullSizeClick = useCallback(() => {
    setFullSize(!fullSize);
  }, [fullSize]);

  const { post, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('postsWithAuthors', postId);
    const fetchedPost = PostsCollection.findOne(postId);

    if (fetchedPost) {
      const author = Meteor.users.findOne({ _id: fetchedPost.authorId });
      return {
        post: { ...fetchedPost, author },
        isLoading: !handle.ready(),
      };
    }

    return {
      post: null,
      isLoading: !handle.ready(),
    };
  });

  if (isLoading) {
    return <ClipLoader size={25} color="#4C3BAB" />;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  const postImageId = post.image;
  const cloud_name = 'cedar-christian-bilingual-school';
  let postImage;
  if (postImageId) {
    postImage = postImageId.startsWith('data:')
      ? <img src={postImageId} className={fullSize ? 'w-screen h-screen object-contain' : 'w-full shadow-lg rounded-2xl bg-gray-50 object-cover object-center lg:h-[34.5rem] '} />
      : (
      <Image cloud_name={cloud_name} publicId={postImageId} quality="auto" fetchFormat="auto" className={fullSize ? 'w-screen h-screen object-contain' : 'w-full shadow-lg rounded-2xl bg-gray-50 object-cover object-center lg:h-[34.5rem]'} aspectRatio="9:16">
        <Transformation quality="auto" crop="fit" gravity="face" />
      </Image>
        );
  } else {
    postImage = <p>No post image</p>;
  }
 return (
  <div className="flex items-center justify-center dark:bg-gray-700/100 min-h-screen py-6 px-4 md:px-8 lg:px-12 mt-16 post-container">
      <div className="container flex flex-col items-center w-full max-w-screen-lg">
        <div className="w-full flex justify-between mb-5">
          <button onClick={handlePrevClick}>
            <FaArrowLeft />
          </button>
          <button onClick={handleNextClick}>
            <FaArrowRight />
          </button>
        </div>

        <div className="w-full">
          <div className="cursor-pointer" onClick={handleFullSizeClick}>
            {postImage}
          </div>
        </div>
      {/* Post Details */}
      <div className="w-full max-w-screen-lg mt-6 bg-white dark:bg-gray-700/100 p-6 rounded shadow-md">
        {/* Category and Date */}


        {/* Actions: Love, Share, Comment Count */}
      <div className="actions-container flex justify-between mt-2 items-center">
        {/* Love section */}

      </div>

        {/* Author Info */}
        <div className="flex items-center mt-4">
        <AuthorProfileImage cloud_name={cloud_name} authorImage={post.author?.profile?.image} />
        <span className="ml-4 text-lg dark:text-gray-400 flex-grow">{post.author?.username || 'Unknown Author'}</span>
        <span className="relative rounded-full bg-gray-300 text-gray-600 dark:bg-gray-600 px-3 py-1.5 font-medium text-gray-400 dark:text-gray-400 mr-5">
                  {post.category}
        </span>
        <span className="relative rounded-full bg-gray-300 text-gray-600 dark:bg-gray-600 px-3 py-1.5 font-medium text-gray-400 dark:text-gray-400">
        <TimeSince date={post.createdAt} />
        </span>
        </div>

        {/* Caption */}
        <h1 className="ml-10 text-2xl dark:text-gray-400 font-semibold mt-4">{post.caption}</h1>

        {/* Description */}
        <div className="ml-12 mt-2 dark:text-gray-400 text-lg leading-relaxed font-medium post-description">
        {showFullDescription
          ? convertDescriptionToHTML(post.description)
          : `${post.description.split(' ').slice(0, 20).join(' ')}...`
        }
      <button
        className="ml-4 rounded-full bg-gray-300 dark:bg-gray-600 dark:text-white p-1 text-sm"
        onClick={() => setShowFullDescription(!showFullDescription)}
      >
        {showFullDescription ? 'Show Less' : 'Read More'}
      </button>
        </div>

      </div>

      {/* Comment Box */}
      <div className="w-full max-w-screen-lg mt-3 p-4 bg-white dark:bg-gray-700/100 rounded shadow-md">
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentBox postId={post._id} post={post} />
        </Suspense>
      </div>
      </div>
  </div>
  );
};

export default memo(PostDetail);
