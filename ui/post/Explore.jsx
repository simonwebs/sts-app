import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../api/collections/posts.collection';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import TimeSince from '../components/TimeSince';
import AuthorProfileImage from '../pages/AuthorProfileImage';

const Explore = () => {
  // Use useState at the beginning
  const [currentPage, setCurrentPage] = useState(1);

  const cloud_name = 'cedar-christian-bilingual-school';
  const { posts, isLoading } = useTracker(() => {
    const postHandle = Meteor.subscribe('postsWithAuthors');
    const fetchedPosts = PostsCollection.find({}).fetch();
    const authorIds = fetchedPosts.map((post) => post.authorId);
    const authors = Meteor.users.find({ _id: { $in: authorIds } }).fetch();
    const postsWithAuthors = fetchedPosts.map((post) => {
      const author = authors.find((a) => a._id === post.authorId);
      return { ...post, author };
    });

    return {
      posts: postsWithAuthors,
      isLoading: !postHandle.ready(),
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <ClipLoader size={25} color={'#4C3BAB'} />
      </div>
    );
  }

  const postsPerPage = 6;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white dark:bg-gray-700 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-300">From the news</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-200">
            Learn how to grow your spiritual life with our expert advice.
          </p>
        </div>
        <div className={'mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-4'}>
          {currentPosts.map((post) => (
            <article key={post._id} className={'flex flex-col items-start justify-between block'}>
              <div className="relative w-full">
                <img
                  src={post.image}
                  alt={post.caption}  
                  width="400"  
                  height="225"  
                  loading="lazy" 
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                <span className='text-lg text-gray-700 dark:text-gray-400'>
              <TimeSince date={post.createdAt} />
            </span>
                  <Link
                    className="relative z-10 rounded-full bg-gray-300 dark:bg-gray-600 dark:text-gray-300 px-3 py-1.5 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 hover:text-gray-500"
                  >
                    {post.category}
                  </Link>
                </div>
                <div className="group relative mt-3">
                  <h3 id='line-clamp-2' className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-gray-300">
                    <Link to={`/post/${post._id}`}>
                      <span className="absolute inset-0" />
                      {post.caption}
                    </Link>
                  </h3>
                  <p id='line-clamp-2'className={'mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300'}>
                    {post.description}
                  </p>
                </div>
                 <div className="relative mt-8 flex items-center gap-x-4">
                  <AuthorProfileImage
                    cloud_name={cloud_name}
                    authorImage={post.author?.profile?.image}
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <Link to={`/profile/${post.author._id}`}>
                        <span className="absolute inset-0" />
                        {post.author.username}
                      </Link>
                    </p>
                    <p className="text-gray-600">{post.author.profile.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    aria-label={`Go to page ${i + 1}`} 
                    className={`rounded-lg bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${i + 1 === currentPage ? 'font-semibold' : ''}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
