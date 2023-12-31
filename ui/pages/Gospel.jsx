import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { PostsCollection } from '../../api/collections/posts.collection';
import { Image, Transformation } from 'cloudinary-react';
import ClipLoader from 'react-spinners/ClipLoader';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PostImage = ({ cloudName, postImage }) => {
  return (
    <div className="aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
      <Image
        cloudName={cloudName}
        publicId={postImage}
        className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
        alt="Post"
      >
        <Transformation crop="fill" quality="auto" fetchFormat="auto" />
      </Image>
    </div>
  );
};

const AuthorProfileImage = ({ cloudName, authorImage }) => {
  if (authorImage) {
    return (
      <Image
        cloudName={cloudName}
        publicId={authorImage}
        width="auto"
        crop="scale"
        quality="auto"
        fetchFormat="auto"
        secure
        dpr="auto"
        responsive
        className="h-10 w-10 rounded-full bg-gray-100"
        alt="Author profile"
      />
    );
  }
  return <p>No profile image</p>;
};

const Gospel = () => {
  const cloudName = 'techpulse';

  const { posts, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('posts.byCategory', 'gospel');

    if (!handle.ready()) {
      return { posts: [], isLoading: true };
    }

    const gospelPosts = PostsCollection.find({ category: 'gospel' }).fetch();
    const authorIds = gospelPosts.map(post => post.authorId);
    const authors = Meteor.users.find({ _id: { $in: authorIds } }).fetch();

    const postsWithAuthor = gospelPosts.map(post => ({
      ...post,
      author: authors.find(author => author._id === post.authorId) || {},
    }));

    return { posts: postsWithAuthor, isLoading: false };
  });

  if (isLoading) {
    return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={25} color={'#4C3BAB'} />
            </div>
    );
  }

  return (
   <div className="bg-white dark:bg-gray-700 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">From the gospel department</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
                        Learn how to grow your business with our expert advice.
                    </p>
                </div>
                    <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20 overflow-y-auto max-h-[70vh]">
                        {posts.map((post) => (
                            <article key={post._id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                                    <PostImage cloudName={cloudName} postImage={post.image} className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover" />

                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-x-4 text-xs">
                                        <time dateTime={post.createdAt} className="text-gray-500">
                  {formatDate(post.createdAt)}
                </time>
                                        <span className="relative z-10 rounded-full bg-gray-300 text-gray-600 dark:bg-gray-600 px-3 py-1.5 font-medium text-gray-400 dark:text-gray-400">
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="group relative max-w-xl">
                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 group-hover:text-gray-600">
                                            <Link to={`/post/${post._id}`}>
                                                {post.caption}
                                            </Link>
                                        </h3>
                                        <p id='line-clamp-2' className="mt-5 text-sm leading-6 text-gray-600 line-clamp-5">
                                            {post.description}
                                        </p>
                                        <Link to={`/post/${post._id}`} className="inline-block mt-2 text-cyan-600 hover:underline">
                                            Read more
                                        </Link>
                                    </div>
                                    <div className="mt-2 flex border-t border-gray-900/5 p-3">
                                        <div className="relative flex items-center gap-x-4">
                                               <AuthorProfileImage cloudName={cloudName} authorImage={post.author?.profile?.image}
                                    className="h-10 w-10 rounded-full bg-gray-100" />
                                            <div className="text-sm leading-6">
                                                <p className="font-semibold text-gray-900 dark:text-gray-200">
                                                    <Link to={`/profile/${post.author._id}`}>
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
            </div>
  );
};

export default Gospel;
