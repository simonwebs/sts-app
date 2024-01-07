import React, { useState, useRef, Fragment } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { Dialog, Transition } from '@headlessui/react';
import { MdAddAPhoto } from 'react-icons/md';
import Cropper from 'react-cropper';

const UserProfilePhotos = ({ onImageUpdated }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const cropperRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageSubmit = () => {
    if (!cropperRef.current) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No image to crop!',
      });
      return;
    }

    const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
    // Start the fake progress bar animation
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setOpen(false);
          setProfileImage(null); // Reset profileImage after successful upload
          onImageUpdated();
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Here you would typically make an API call to upload the cropped image
    Meteor.call('users.uploadProfileImage', croppedImage, (error) => {
      clearInterval(interval);
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to upload profile image!',
        });
      } else {
        Swal.fire('Success', 'Profile image uploaded successfully!', 'success');
      }
      setProgress(0);
    });
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} className="p-1 bg-white/20 rounded-full shadow-lg">
        <MdAddAPhoto className="w-6 h-6 text-gray-400 hover:text-gray-400/70  hover:shadow-md" />
      </button>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Update Profile Image
                </Dialog.Title>
                <div className="mt-2">
                  {profileImage && (
                    <Cropper
                      src={profileImage}
                      style={{ height: 400, width: '100%' }}
                      initialAspectRatio={1}
                      aspectRatio={1}
                      preview=".img-preview"
                      guides={false}
                      ref={cropperRef}
                      viewMode={1}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
                </div>

                <div className="mt-4">
                  {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded h-1.5 dark:bg-gray-700">
                      <div
                        className="bg-lime-600 h-1.5 rounded"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="mt-5 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleProfileImageSubmit}
                  >
                    Crop & Upload
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>

                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserProfilePhotos;
