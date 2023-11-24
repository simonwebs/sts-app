import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../../../api/collections/posts.collection';
import { CommentsCollection } from '../../../../api/collections/CommentsCollection';
import TimeSince from '../../../components/TimeSince';

const GuestDefaultComponent = () => {
  const { likedPosts, myComments } = useTracker(() => {
    const userId = Meteor.userId();
    
    // Remove the handles here
    Meteor.subscribe('likedPosts', userId);
    Meteor.subscribe('myComments', userId);

    const likedPosts = PostsCollection.find({ 'lovedBy': userId }).fetch();
    const myComments = CommentsCollection.find({ 'authorId': userId }).fetch();

    return { likedPosts, myComments };
  });
  if (!Meteor.userId()) {
    return <h2 className="text-2xl font-semibold text-center py-5">Please log in to view your liked posts and comments.</h2>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800/100 min-h-screen p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-5 shadow-md dark:bg-gray-800/100">
        <h2 className="text-3xl font-semibold mb-4 dark:text-gray-500">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3 dark:text-cyan-500">Posts I Like:</h3>
            <ul className="list-inside list-disc">
              {likedPosts.map((post) => (
                <li key={post._id} className="mb-2 text-lg dark:text-gray-400">
                  {post.caption} <span className="truncate text-gray-500 dark:text-gray-400"><TimeSince date={post.createdAt} /></span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-3 dark:text-cyan-500">Comments I Made:</h3>
            <ul className="list-inside list-disc">
              {myComments.map((comment) => (
                <li key={comment._id} className="mb-2 text-lg dark:text-gray-400">
                  {comment.content} <span className="truncate text-gray-500 dark:text-gray-300"><TimeSince date={comment.createdAt} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDefaultComponent;
