import React from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaTimes, FaInfoCircle } from 'react-icons/fa';


const ProfileCard = ({ user, onSwipeLeft, onSwipeRight, onViewDetails, likedByUsers }) => {
  const { _id, firstName, birthDate, personalBio, profilePhotos, isOnline, authorId } = user;

  const photoUrl = profilePhotos?.[0]?.photoUrl || getDefaultImage();

  const age = birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() : 'N/A';
  const statusStyle = isOnline ? 'text-green-500' : 'text-gray-500';

  const likedByCount = likedByUsers?.length; // No need for optional chaining here since we have a default value

  const handleProfileClick = (event) => {
    event.stopPropagation(); // Prevent event from propagating to parent elements
    onViewDetails(authorId);
  };

  return (
    <div className="flex justify-center items-center dark:bg-gray-700 w-full"> {/* Removed dark: prefix for consistency */}
      <div className="profile-card max-w-md mx-auto bg-white dark:bg-gray-700/70 rounded overflow-hidden shadow-lg p-4 text-center"> {/* Removed dark: prefix for consistency */}
        {/* Image container with conditional margin-bottom */}
        <div className="relative mb-4 lg:mb-0" onClick={handleProfileClick}> {/* Removed fixed mb-8 and added lg:mb-0 to remove margin at lg screens */}
          <img src={photoUrl} alt={`${firstName}'s profile`} className="w-full rounded-2xl bg-gray-100 object-cover" /> {/* Removed aspect ratio classes to allow natural image size */}
          {/* Absolute positioned overlay if needed */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-700/10"></div>
        </div>
        {/* Profile information */}
        <div className="profile-info">
          {/* Name and status */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 font-semibold">{firstName}, {age}</h2>
            <span className={`status-indicator text-gray-700 dark:text-gray-300 ${statusStyle}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          {/* Personal bio */}
          <p className="text-gray-700 text-base dark:text-gray-200">{personalBio}</p>
        </div>
        {/* Profile actions */}
        <div className="profile-actions mt-4"> {/* Added mt-4 to ensure space between text and buttons */}
          <button onClick={() => onSwipeLeft(_id)} className="pass-button">
            <FaTimes size="1em" />
          </button>
          <button onClick={() => onSwipeRight(_id)} className="like-button relative">
      <FaHeart size="1em" />
      {/* Only display the count badge if there are likes */}
      {likedByCount > 0 && (
        <span className="like-count absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {likedByCount}
        </span>
      )}
    </button>

          <button onClick={() => onViewDetails(authorId)} className="details-button">
            <FaInfoCircle size="1em" />
          </button>
        </div>
      </div>
    </div>
  );
  
};


ProfileCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profilePhotos: PropTypes.arrayOf(PropTypes.shape({
      photoUrl: PropTypes.string,
      isProfilePhoto: PropTypes.bool,
    })),
    firstName: PropTypes.string.isRequired,
    birthDate: PropTypes.string,
    personalBio: PropTypes.string,
  }),
  onSwipeLeft: PropTypes.func.isRequired,
  onSwipeRight: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ProfileCard;

// Helper function to get a default image if none is provided
const getDefaultImage = () => {
  // Placeholder for a default image; you should replace the string below with an actual base64 image string
  return 'data:image/png;base64,iVBORw0KGgo...'; // Full base64 string needed here
};
