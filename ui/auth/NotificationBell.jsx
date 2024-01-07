import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import UserContact from './UserContact';
import { Meteor } from 'meteor/meteor';

const NotificationBell = ({ onUserSelect, currentUserId, profileUserId }) => {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const count = await Meteor.call('notifications.getNotificationCount', currentUserId);
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleOpenDialog = async () => {
    fetchNotificationCount();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const isCurrentUserProfile = currentUserId === profileUserId;

  useEffect(() => {
    // Fetch notification count when the component mounts
    fetchNotificationCount();
  }, [currentUserId, profileUserId]);
  return (
    <div className="relative">
      <button
        onClick={handleOpenDialog}
        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring"
      >
        <div className="relative">
          <BellIcon className="h-6 w-6" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 text-xs">
              {notificationCount}
            </span>
          )}
        </div>
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-50"
          onClose={handleCloseDialog}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Overlay className="absolute inset-0 bg-white bg-opacity-10 transition-opacity z-10" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transform ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="fixed inset-y-0 right-0 max-w-full flex z-20">
                <div className="w-screen max-w-md bg-white dark:bg-gray-700 shadow-lg mt-16">
                  {isCurrentUserProfile && <UserContact onUserSelect={onUserSelect} />}
                 <div className="absolute top-4 right-4">
                    <button
                      onClick={handleCloseDialog}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-8 w-8 text-current" // Set the icon color based on the current text color
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
          </Dialog>
      </Transition.Root>
    </div>
  );
};

NotificationBell.propTypes = {
  profileUserId: PropTypes.string,
  onUserSelect: PropTypes.func,
  currentUserId: PropTypes.string, // Making it optional by removing `isRequired`
};

export default NotificationBell;
