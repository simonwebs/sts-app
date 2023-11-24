import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../../api/collections/posts.collection';

const EditPost = () => {
  const { postId } = useParams();
  const { post, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('postsWithAuthors');

    if (!handler.ready()) {
      return { post: null, isLoading: true };
    }

    const post = PostsCollection.findOne(postId);
    return { post, isLoading: false };
  });

  const [caption, setCaption] = useState(post?.caption || '');
  const [description, setDescription] = useState(post?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!caption || !description) {
      alert('Please fill in all fields');
      return;
    }

    Meteor.call('posts.edit', postId, caption, description, (error) => {
      if (error) {
        alert(error.error);
      } else {
        alert('Post updated successfully');
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Caption
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};
export default EditPost;
