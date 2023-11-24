import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-cropper';
import { MdAddAPhoto } from 'react-icons/md';

const AlbumForm = ({ showModal, setShowModal }) => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cropperRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setMedia(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleAlbumSubmit = async (event) => {
    event.preventDefault();

    if (!caption || !media) {
      Swal.fire('Oops...', 'Please fill all required fields!', 'error');
      return;
    }

    const currentUser = Meteor.user();
    if (!currentUser) {
      Swal.fire('Oops...', 'You are not authenticated!', 'error');
      return;
    }

    const authorId = currentUser._id;

    setIsLoading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(progressInterval);
          return oldProgress;
        }
        const newProgress = oldProgress + 10;
        return newProgress;
      });
    }, 500);

    try {
      const croppedImageBase64 = cropperRef.current.cropper.getCroppedCanvas().toDataURL('image/jpeg');
      const croppedImageBlob = await (await fetch(croppedImageBase64)).blob();
      const compressedImage = await imageCompression(croppedImageBlob, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onloadend = function () {
        const base64data = reader.result;
        Meteor.call('albums.create', authorId, caption, base64data, (err, albumId) => {
          setIsLoading(false);
          setProgress(0);
          if (err) {
            Swal.fire('Oops...', 'Something went wrong!', 'error');
            console.error(err);
          } else if (!albumId) {
            Swal.fire('Oops...', 'Something went wrong!', 'error');
            console.error('AlbumId is undefined or null');
          } else {
            Swal.fire('Success!', 'Your post has been created.', 'success');
            setCaption('');
            setMedia(null);
            setShowModal(false); // Ensure this is being executed
          }
        });
      };
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-[1999] py-12 px-8 ${showModal ? 'block' : 'hidden'}`}>
           <div className="relative p-6 bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 mt-10 overflow-hidden">
            {/* Buttons positioned at the top */}
          <div className="flex justify-end space-x-2" style={{ marginBottom: '7px' }}>
            <button
              className="py-2 px-4 bg-primary dark:bg-green-500 text-white rounded shadow-lg"
              disabled={isLoading}
              onClick={handleAlbumSubmit}
              aria-label="Publish photo"
            >
              Publish photo
            </button>
            <button
              className="py-2 px-4 bg-red-500 text-white rounded shadow-lg"
              onClick={() => setShowModal(false)}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>

          {/* Form with proper spacing for caption and image upload */}
          <form onSubmit={handleAlbumSubmit}>
            <div className="mb-4">
             <label className="album-form-label">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
                placeholder="Caption"
                maxLength="50"
              />
              <label className="block w-full p-2 mt-4 border border-gray-300 rounded mb-4 cursor-pointer text-center">
                <MdAddAPhoto size={24} />
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
            {media && (
              <Cropper
                src={media}
                style={{ height: 400, width: '100%' }}
                aspectRatio={4 / 3}
                guides={false}
                ref={cropperRef}
              />
            )}
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative pt-1 w-2/3">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    Loading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-teal-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumForm;