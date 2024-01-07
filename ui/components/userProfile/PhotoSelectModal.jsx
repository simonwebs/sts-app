import React, { useState } from 'react';
import Modal from 'react-modal';
import UserProfilePhotos from './UserProfilePhotos';
import Swal from 'sweetalert2';

const PhotoSelectModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 files
    setSelectedFiles(files);
  };

  const handleSelect = () => {
    // You can perform additional validation or processing here
    onSelect(selectedFiles);
    setSelectedFiles([]);
    onClose();

    // Display success message using Swal
    Swal.fire({
      icon: 'success',
      title: 'Photos Submitted Successfully!',
      showConfirmButton: false,
      timer: 1500, // Adjust as needed
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Photo Select Modal"
      className="modal" // Add your custom modal styles here
      overlayClassName="overlay" // Add your custom overlay styles here
    >
      <div className="p-4 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Select Photos</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="mb-4"
        />
        <UserProfilePhotos profilePhotos={selectedFiles} setProfilePhotos={() => {}} />
        <button
          onClick={handleSelect}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default PhotoSelectModal;
