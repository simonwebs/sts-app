import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../api/collections/posts.collection';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Image, Transformation } from 'cloudinary-react';
import AuthorProfileImage from '../pages/AuthorProfileImage';
import TimeSince from '../components/TimeSince';

const PostImage = ({ cloud_name, postImage, post }) => (
  <div className="aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
    <Image
cloud_name={cloud_name}
     publicId={postImage}
     className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
     width={400}
    height={300}
    alt={`Post by ${post?.author?.username}`}
  >
    <Transformation crop="fill" quality="auto" fetchFormat="auto" />
    </Image>
  </div>
);

const usePosts = () => {
  const { posts, isLoading } = useTracker(() => {
    const postHandle = Meteor.subscribe('postsWithAuthors');
    const fetchedPosts = PostsCollection.find({}).fetch();
    const authorIds = fetchedPosts.map(post => post.authorId);
    const authors = Meteor.users.find({ _id: { $in: authorIds } }).fetch();
    const postsWithAuthors = fetchedPosts.map(post => {
      const author = authors.find(a => a._id === post.authorId);
      return { ...post, author };
    });

    return {
      posts: postsWithAuthors,
      isLoading: !postHandle.ready(),
    };
  });

  return { posts, isLoading };
};

const News = () => {
  const cloud_name = 'cedar-christian-bilingual-school';
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={25} color="#4C3BAB" />
      </div>
    );
  }
  const postTitle = posts.length === 1 ? 'post' : `${posts.length} posts`;
  return (
    <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 border-1 shadow-border-cyan-500 p-4 rounded-lg py-16 sm:py-32 px-6 mt-4">
      <div className="mx-auto max-w-2xl text-center">
                    <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">From the news department</h3>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
                        Learn how to grow your business with our expert advice.
                    </p>
                    <p>{postTitle}</p>
      </div>
      <div className="mt-5 space-y-12 lg:mt-4 lg:space-y-8 overflow-y-auto max-h-[70vh] lg:grid lg:grid-cols-2 lg:gap-8">
        {posts.map((post) => (
          <article key={post._id} className="relative isolate flex flex-col gap-8 lg:flex-row">
            <div className="relative" style={{ minHeight: '250px' }}>
              <PostImage cloud_name={cloud_name} postImage={post.image} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-x-4 text-xs">
                <span className="text-gray-500">
                <TimeSince date={post.createdAt} />
                </span>
                <span className="relative rounded-full bg-gray-300 text-gray-600 dark:bg-gray-600 px-3 py-1.5 font-medium text-gray-400 dark:text-gray-400">
                  {post.category}
                </span>
              </div>
              <div className="group relative max-w-xl">
                <h3 id="line-clamp-2" className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 group-hover:text-gray-600">
                  <Link to={`/post/${post._id}`}>
                    {post.caption}
                  </Link>
                </h3>
                <p id="line-clamp-3" className="mt-5 text-sm leading-6 text-gray-600  dark:text-gray-400 line-clamp-3">
                  {post.description}
                </p>
                <Link to={`/post/${post._id}`} className='dark:text-gray-400' aria-label={`Read more about ${post.caption}`}>
                 Read more
                </Link>

              </div>
              <div className="mt-2 flex border-t border-gray-900/5 p-3">
                <div className="relative flex items-center gap-x-4">
                  <AuthorProfileImage cloud_name={cloud_name} authorImage={post.author?.profile?.image} />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 dark:text-gray-200">
                    <Link to={`/profile/${post.author._id}`} aria-label={`Go to ${post.author?.username}'s profile`}>
  {post.author?.username}
                    </Link>
                    </p>
                    <p className="text-gray-600">{post.author?.profile?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
export default React.memo(News);
