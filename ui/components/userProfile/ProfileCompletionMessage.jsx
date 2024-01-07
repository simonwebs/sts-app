// Import the necessary dependencies
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfilePhotos from './UserProfilePhotos';

const ProfileCompletionMessage = ({ userId, authorId }) => {
  const [isProfilePhotosModalOpen, setIsProfilePhotosModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Get the navigate function

  const handleCloseProfilePhotosModal = () => {
    setIsProfilePhotosModalOpen(false);
  };

  const handleProfilePhotosUpdated = () => {
    // Additional actions with selected files

    // Navigate to the profile page after updating the photo
    navigate('/');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Created Successfully!</h2>
        <p className="text-gray-600">
          Congratulations on creating your profile! To enhance your profile, add some photos that showcase
          your personality and interests.
        </p>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePhotosUpdated}
          className="hidden"
          ref={fileInputRef}
        />
        <UserProfilePhotos
          isVisible={isProfilePhotosModalOpen}
          onClose={handleCloseProfilePhotosModal}
          onImageUpdated={handleProfilePhotosUpdated}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default ProfileCompletionMessage;
