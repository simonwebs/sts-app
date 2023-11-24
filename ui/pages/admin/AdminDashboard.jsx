import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import AlbumForm from './forms/AlbumForm'; // replace with your actual path
import NewPostForm from './forms/NewPostForm'; // replace with your actual path
import { Roles } from 'meteor/alanning:roles';
import AppRoles from '../../../infra/AppRoles';
import { useLoggedUser } from 'meteor/quave:logged-user-react';

const AdminDashboard = () => {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // Managing posts with state for simplicity.
  const { loggedUser } = useLoggedUser(); // Using the hook to get the logged user

  const isAdmin = Roles.userIsInRole(loggedUser?._id, AppRoles.ADMIN);

  useEffect(() => {
    if (!isAdmin) {
      setError('You do not have permission to access this page.');
    }
  }, [isAdmin]);

  const handleNewPost = (postData) => {
    Meteor.call('posts.add', postData, (error, result) => {
      if (error) {
        setError(error.reason);
      } else {
        setPosts([...posts, postData]);
      }
    });
  };

  const handleNewAlbum = (albumData) => {
    Meteor.call('albums.add', albumData, (error, result) => {
      if (error) {
        setError(error.reason);
      }
    });
  };

  if (!isAdmin) {
    return <p>You do not have permission to access this page.</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* New Post Section */}
      <div>
        <h3>Create New Post</h3>
        <NewPostForm onSubmit={handleNewPost} />
      </div>

      {/* Create Album Section */}
      <div>
        <h3>Create New Album</h3>
        <AlbumForm onSubmit={handleNewAlbum} />
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AdminDashboard;
