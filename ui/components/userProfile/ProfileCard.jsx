import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaTimes, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { Image, Transformation } from 'cloudinary-react';
import { Link } from 'react-router-dom';

const ProfileCard = ({ user, onSwipeLeft, onSwipeRight, onViewDetails, likedByUsers }) => {
  const { _id, profile, username, status } = user;
  const { birthDate, images, personalBio } = profile || {};
  const likedByCount = likedByUsers?.length;

  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const handleProfileClick = (event) => {
    event.stopPropagation();
    onViewDetails(_id);
  };

  const handleLikeClick = () => {
    // Update the UI immediately to provide feedback to the user
    onSwipeRight(_id);

    // Call the server-side method to handle the like action
    Meteor.call('likeProfile', _id, (error) => {
      if (error) {
        if (error.error === 'already-liked') {
          // Display a customized SweetAlert2 popup for duplicate liking
          Swal.fire({
            title: '<span style="color: #ff3366; font-size: 1.5rem;">Oops! 😕</span>',
            html: '<span style="color: #6b7280; font-size: 1rem;">You have already liked this profile.</span>',
            confirmButtonText: 'OK',
            width: 200,
            heightAuto: true,
            customClass: {
              container: 'smaller-sweetalert',
              popup: 'smaller-sweetalert-popup',
              title: 'smaller-sweetalert-title',
              htmlContainer: 'smaller-sweetalert-html-container',
              confirmButton: 'smaller-sweetalert-confirm-button',
            },
          }).then(() => {
            // Move to the next profile
            setCurrentProfileIndex(currentProfileIndex + 1);
            // Fetch details of the next profile using the updated index
            // Example: fetchNextProfileDetails(currentProfileIndex);
          });
        } else {
          console.error('Error liking profile:', error);
          // Optionally, you can show a generic error message to the user
        }
      }
    });
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="profile-card max-w-md mx-auto bg-white dark:bg-gray-700 rounded overflow-hidden shadow-lg text-center">
        <div className="relative mb-4 lg:mb-0">
          <Link to={`/profile/${_id}`} onClick={() => onViewDetails(_id)}>
            <div className="overflow-hidden rounded-lg shadow-md relative">
              {images?.map((image, index) => (
                <Image
                  key={index}
                  cloudName="techpulse"
                  publicId={image.publicId}
                  width="auto"
                  crop="scale"
                  quality="auto"
                  fetchFormat="auto"
                  secure={true}
                  responsive={true}
                  alt={`${username}'s Avatar`}
                  className={`profile-image transition-transform duration-300 ease-in-out transform ${
                    index > 0 ? 'skew-img' : ''
                  }`}
                >
                  <Transformation aspectRatio="1:1" crop="fill" />
                </Image>
              ))}
            </div>
          </Link>
        </div>
        <div className="profile-info mt-4">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 font-medium">
              {username}, {calculateAge(birthDate)}
            </h3>
            <span className={`status-indicator mb-5 ${status?.online ? 'text-green-600' : 'text-gray-500'} ml-3`}>
              {status?.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-gray-600 text-sm dark:text-gray-400 self-start">{personalBio}</p>
        </div>
       <div className="profile-actions mt-2">
          <button onClick={() => onSwipeLeft(_id)} className="pass-button">
            <FaTimes size="1em" />
          </button>
          <button onClick={handleLikeClick} className="like-button relative">
            <FaHeart size="1em" />
            {likedByCount > 0 && (
              <span className="like-count absolute top-0.5 right-0.5 bg-red-500 text-white text-xs font-semibold px-2 rounded-full">
                {likedByCount}
              </span>
            )}
          </button>
          <button onClick={() => handleProfileClick(_id)} className="details-button">
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
    profile: PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.string),
      birthDate: PropTypes.string,
      personalBio: PropTypes.string,
    }),
    username: PropTypes.string,
    status: PropTypes.shape({
      online: PropTypes.bool,
    }),
  }),
  onSwipeLeft: PropTypes.func.isRequired,
  onSwipeRight: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  likedByUsers: PropTypes.arrayOf(PropTypes.string),
};

export default ProfileCard;
