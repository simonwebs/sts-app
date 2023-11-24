// Category.jsx
import React, { lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../api/collections/posts.collection';
import { Meteor } from 'meteor/meteor';
import ClipLoader from 'react-spinners/ClipLoader';

const PostCard = lazy(() => import('./PostCard'));

const Category = () => {
  const { categoryName } = useParams();

  const { posts, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('posts.byCategory', categoryName);

    if (!handle.ready()) {
      return { posts: [], isLoading: true };
    }

    const postsInCategory = PostsCollection.find({ category: categoryName }, { sort: { createdAt: -1 } }).fetch();
    return { posts: postsInCategory, isLoading: false };
  });

  if (isLoading) {
    return <div><ClipLoader size={25} color={'#4C3BAB'} /></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {posts?.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
};

export default Category;
