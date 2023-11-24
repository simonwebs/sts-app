import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const UserProfilePhotos = ({ profilePhotos, setProfilePhotos }) => {
  // Use refs to keep track of Cropper instances for each photo
  const cropperRefs = useRef([]);

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedProfilePhotos = [...profilePhotos];
        updatedProfilePhotos[index] = {
          ...updatedProfilePhotos[index],
          photoUrl: reader.result,
          isProfilePhoto: index === 0, // First photo is the profile photo by default
        };
        setProfilePhotos(updatedProfilePhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (index) => {
    // Access the cropper instance for the current photo and get the cropped image data URL
    if (cropperRefs.current[index]) {
      const croppedImageUrl = cropperRefs.current[index].cropper.getCroppedCanvas().toDataURL();
      const updatedProfilePhotos = [...profilePhotos];
      updatedProfilePhotos[index] = {
        ...updatedProfilePhotos[index],
        photoUrl: croppedImageUrl,
        isProfilePhoto: updatedProfilePhotos[index].isProfilePhoto,
      };
      setProfilePhotos(updatedProfilePhotos);
    }
  };

  const clearImage = (index) => {
    const updatedProfilePhotos = [...profilePhotos];
    updatedProfilePhotos[index] = {
      ...updatedProfilePhotos[index],
      photoUrl: '',
      isProfilePhoto: false,
    };
    setProfilePhotos(updatedProfilePhotos);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Photos</h2>
      {profilePhotos.map((photo, index) => (
        <div key={index} className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, index)}
            className="mb-2"
          />
          {photo.photoUrl && (
            <div>
              <Cropper
                src={photo.photoUrl}
                ref={(el) => { cropperRefs.current[index] = el; }}
                style={{ height: 200, width: '100%' }}
                aspectRatio={1}
                guides={false}
              />
              <button onClick={() => handleCrop(index)}>
                Save Cropped Image
              </button>
              <button onClick={() => clearImage(index)}>
                Clear
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfilePhotos;
