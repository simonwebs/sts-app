// @ts-nocheck
import { LazyLoadImage } from 'react-lazy-load-image-component';
import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../api/collections/posts.collection';
import { Link, useNavigate } from 'react-router-dom';

const ProfileItem = ({ label, value, children }) => {
  return (
    <div className="flex justify-between items-center my-2">
      <h4 className="text-gray-600 dark:text-white">
        <strong>{capitalizeFirstLetter(label)}:</strong>
      </h4>
      <div className="flex items-center">
        <p className="text-gray-600 dark:text-white">
          {capitalizeFirstLetter(value)}
        </p>
        {children}
      </div>
    </div>
  );
};
const UserProfileList = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(1);

  const { user, posts, isLoading } = useTracker(() => {
    const noDataAvailable = { posts: [], isLoading: true };
    const userHandler = Meteor.subscribe('usersData');
    if (!userHandler.ready()) {
      return noDataAvailable;
    }

    const user = Meteor.users.findOne(Meteor.userId());

    const postHandler = Meteor.subscribe('posts.withAuthors', limit);
    if (!postHandler.ready()) {
      return { ...noDataAvailable, user };
    }

    const posts = PostsCollection.find(
      { authorId: Meteor.userId() },
      { sort: { createdAt: -1 } },
    ).fetch();

    return { user, posts, isLoading: false };
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [posts]);

  const capitalizeFirstLetter = (string) => {
    return typeof string === 'string' ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };
  const handleDeletePost = (postId) => {
    Meteor.call('posts.delete', postId, (error) => {
      if (error) {
        // console.error('Error deleting post', error);
      }
    });
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div className="m-4 sm:m-8">
      {isLoading
        ? (
        <div>Loading...</div>
          )
        : (
            user && (
   <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
  <div className="bg-white dark:bg-slate-800 shadow rounded p-4 sm:p-6 md:p-6 lg:p-8 xl:p-8 2xl:p-8 mb-10">
    <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold mb-2 text-blue-600">{user.username}</h2>
    <ProfileItem label="Bio" value={user.profile.bio} />
    <ProfileItem label="Gender" value={user.profile.gender} />
    <ProfileItem label="Profession" value={user.profile.profession} />
    <ProfileItem label="Location" value={user.profile.location} />
    <ProfileItem label="Marital Status" value={user.profile.maritalStatus} />
    <ProfileItem label="Number of Friends" value={user.friends?.length || 0}>
      <button
        className="rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
      >
        {user.friends?.length || 0}
      </button>
    </ProfileItem>
    <ProfileItem label="Number of Posts Created" value={posts.length}>
      <button
        className="rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
      >
        {posts.length}
      </button>
    </ProfileItem>
  </div>
            <div className="bg-white dark:bg-slate-800 shadow rounded p-4 sm:p-6 lg:p-8 mb-10">
              {!isLoading && posts[currentIndex] && (
                <div key={posts[currentIndex]._id} className="bg-white dark:bg-gray-700 shadow-md rounded-md p-6">
                  <div key={posts[currentIndex]._id} className="group relative">
                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md dark:bg-slate-800 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <Link to={`/post/${posts[currentIndex]._id}`} key={posts[currentIndex]._id}>
                        <h3 className="truncate ml-14 font-semibold dark:text-white text-lg">{capitalizeFirstLetter(posts[currentIndex].caption)}</h3>
                        {posts[currentIndex].image && <LazyLoadImage src={posts[currentIndex].image} alt="Post" className="h-full w-full object-cover object-center lg:h-full lg:w-full" />}
                      </Link>
                    </div>
                    <button className="rounded bg-primary dark:bg-primary hover:text-primary px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white/20 mr-10" onClick={() => handleEditPost(posts[currentIndex]._id)}>Edit</button>
                    <button onClick={() => handleDeletePost(posts[currentIndex]._id)} className="rounded bg-red-500 hover:text-white px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-opacity-75 mr-10">Delete</button>
                  </div>
                  <button className="rounded bg-gray-500 dark:bg-primary hover:text-primary px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white/20 mr-10" onClick={() => setLimit(limit - 1)} disabled={limit === 1}>
      Previous
    </button>
    <button className="rounded bg-gray-700 dark:bg-gray-700 hover:text-white px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary" onClick={() => setLimit(limit + 1)}>
      Next
    </button>
                </div>
              )}
            </div>
          </div>
            )
          )}
    </div>
  );
};
export default UserProfileList;
