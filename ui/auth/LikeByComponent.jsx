// Client-side component
import React, { useState } from 'react';

const LikeByComponent = ({ likedBy, likedUsers }) => {
  const [showLikes, setShowLikes] = useState(false);

  const toggleLikes = () => {
    setShowLikes(!showLikes);
  };

  return (
    <div>
      <h2>Likes</h2>

      <button onClick={toggleLikes}>
        {showLikes ? 'Hide Likes' : 'Show Likes'}
      </button>

      {showLikes && (
        <div>
          <h3>Liked By:</h3>
          <ul>
            {likedBy.map((user) => (
              <li key={user._id}>{user.username}</li>
            ))}
          </ul>

          <h3>Liked Users:</h3>
          <ul>
            {likedUsers.map((user) => (
              <li key={user._id}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LikeByComponent;
