import React, { lazy, Suspense } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../api/collections/posts.collection';
import ClipLoader from 'react-spinners/ClipLoader';

const PostCardItem = lazy(() => import('./PostCardItem'));

const PostCard = () => {
  const { posts, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('postsWithAuthors');

    if (!handle.ready()) {
      return { posts: [], isLoading: true };
    }

    const posts = PostsCollection.find({}, { sort: { createdAt: -1 } }).fetch().map(post => {
      const author = Meteor.users.findOne(post.authorId);
      return { ...post, author };
    });

    return { posts, isLoading: false };
  });

  if (isLoading) {
    return (
      <div>
        <ClipLoader size={25} color={'#4C3BAB'} />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4">
      <Suspense fallback={<ClipLoader size={25} color={'#4C3BAB'} />}>
        {posts?.map((post) => {
          if (!post?.author) {
            return null;
          }

          return (
            <PostCardItem key={post._id} post={post} author={post.author} />
          );
        })}
      </Suspense>
    </div>
  );
};

export default PostCard;
