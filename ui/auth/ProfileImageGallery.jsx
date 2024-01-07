import React, { useEffect, useState } from 'react';
import { UsersCollection } from '../../api/collections/UsersCollection';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Image } from 'cloudinary-react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import UserProfileUpdate from './UserProfileUpdate';

const ProfileImageGallery = ({ selectedImageData }) => {
  const { userId } = useParams();
  const cloudName = 'techpulse';

  const { userData, currentUser } = useTracker(() => {
    Meteor.subscribe('userProfileData', userId);

    return {
      userData: UsersCollection.findOne({ _id: userId }),
      currentUser: Meteor.user(),
    };
  }, [userId]);

  useEffect(() => {
    // Access userData in the component
    console.log('Current User Data:', userData);
  }, [userData]);

  const defaultProfileImage = 'https://via.placeholder.com/150';

  const handleDeleteImage = (publicId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Meteor.call('users.deleteImage', publicId, (error, result) => {
          if (error) {
            console.error('Error deleting image:', error);
            Swal.fire('Error', 'Failed to delete image', 'error');
          } else {
            console.log('Image deleted successfully:', result);
            Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
          }
        });
      }
    });
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageSelection = (index) => {
    setSelectedImageIndex(index);
  };

  if (!userData) {
    // Loading state while data is being fetched
    return <div>Loading...</div>;
  }

  const isOwner = currentUser && userId === currentUser._id;

  return (
    <div className="overflow-x-auto w-full md:w-screen lg:w-screen-xl dark:bg-gray-700">
      <div className="flex flex-col p-4 space-y-4">
        <div className="text-2xl font-semibold dark:text-gray-300">
          ({userData?.profile?.images.length})&nbsp;
          {userData?.profile?.images.length === 1 ? 'Image' : 'Images'}
        </div>
        <div className="flex space-x-4">
          {userData?.profile?.images.map((image, index) => (
            <div key={index} className="flex-none relative">
              <div className="relative group">
                {isOwner && (
                  <div className="absolute top-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteImage(image.publicId)}
                    />
                  </div>
                )}
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isOwner && selectedImageIndex === index && (
                    <UserProfileUpdate
                      image={userData?.profile?.images[index]}
                      onImageSelected={() => handleImageSelection(index)}
                      selectedImageData={selectedImageData}
                    />
                  )}
                </div>
                <Image
                  cloudName={cloudName}
                  publicId={image.publicId || defaultProfileImage}
                  alt={`Image ${index}`}
                  className="object-cover h-32 md:h-40 lg:h-40 w-32 md:w-40 lg:w-40 rounded-2xl cursor-pointer"
                  onClick={() => handleImageSelection(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageGallery;
