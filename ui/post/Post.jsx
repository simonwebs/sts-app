import React, { lazy } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../api/collections/posts.collection';
import { Meteor } from 'meteor/meteor';
import ClipLoader from 'react-spinners/ClipLoader';

const PostCard = lazy(() => import('./PostCard'));

const Post = () => {
  const { posts, isLoading } = useTracker(() => {
    const postsSubscription = Meteor.subscribe('postsWithAuthors');

    if (!postsSubscription.ready()) {
      return { posts: [], isLoading: true };
    }

    const posts = PostsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
    return { posts, isLoading: false };
  });
  if (isLoading) {
    return <div><ClipLoader size={25} color={'#4C3BAB'} /></div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {posts?.map(post => <PostCard key={post._id} post={post} />)
      }
    </div>
  );
};
export default Post;
