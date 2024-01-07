// UserProfileUpdate.jsx
import React, { useState, Fragment, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';
import { Dialog, Transition } from '@headlessui/react';
import { MdAddAPhoto } from 'react-icons/md';


const UserProfileUpdate = ({ image, onImageSelected, onImageUpdateSubmit, selectedImageData }) => {
  console.log('UserProfileUpdate - selectedImageData:', selectedImageData);

  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

 useEffect(() => {
    console.log('UserProfileUpdate - selectedImageData:', selectedImageData);
  }, [selectedImageData]);

  const handleProfileImageSubmit = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setOpen(false);
          onImageSelected(image);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Here you would typically make an API call to upload the selected image
    Meteor.call('users.uploadProfileImage', image, (error) => {
      clearInterval(interval);
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to upload profile image!',
        });
      } else {
        Swal.fire('Success', 'Profile image uploaded successfully!', 'success');
        // Optionally, you can trigger an additional callback for the parent component
        if (typeof onImageUpdateSubmit === 'function') {
          onImageUpdateSubmit();
        }
      }
      setProgress(0);
    });
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} className="p-1 bg-white/20 rounded-full shadow-lg">
        <MdAddAPhoto className="w-5 h-5 text-gray-400 hover:text-gray-400/70 hover:shadow-md" />
      </button>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setOpen(false)}>
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
                <img
                  src={selectedImageData || image}
                  alt="Selected Image"
                  className="object-cover h-40 w-full rounded-2xl"
                />

                <div className="mt-4">
                  {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded h-1.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-1.5 rounded"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="mt-5 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleProfileImageSubmit}
                  >
                    Submit
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

export default UserProfileUpdate;
