import { Meteor } from 'meteor/meteor';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import Swal from 'sweetalert2';

import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'cloudinary-react';

const AdminMenu = () => {
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of your account.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        Meteor.logout((error) => {
          if (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error logging out! Please try again.',
            });
          } else {
            navigate('/login');
          }
        });
      }
    } catch (err) {
     // console.error('Error during logout:', err);
    }
  };

  const profileImageId = loggedUser?.newImage || loggedUser?.profile?.image || 'https://res.cloudinary.com/cedar-christian-bilingual-school/image/upload/v1699427731/lvndoftttkwhiylyb50f.png';
  const username = loggedUser?.username;
  const cloud_name = 'cedar-christian-bilingual-school';

  if (isLoadingLoggedUser) {
    return <p>Loading...</p>;
  }

  return (
    <Menu as="div" className="relative inline-block text-left dark:bg-cyan-800/100 z-60">
      {({ open }) => (
        <>
          <div className="flex items-center">
            <Menu.Button className="flex justify-center items-center px-2 py-1 text-sm font-medium text-white rounded-md hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              {profileImageId.startsWith('data:')
                ? (
                <img src={profileImageId} className="w-8 h-8 rounded-full border-4 border-white" alt="User profile" />
                  )
                : (
                <Image cloud_name={cloud_name} publicId={profileImageId} width="80" height="80" crop="fill"
                    quality="auto" fetchFormat="auto" secure dpr="auto" responsive className="w-8 h-8 rounded-full border-4 border-white"
                    alt="User profile"
                />
                  )}
            </Menu.Button>
            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-200 hidden lg:block">{username}</p>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items static className="absolute -right-3 -mr-5 w-28 mt-4 origin-top-right bg-white divide-y divide-cyan-100 rounded-md shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none bg-cyan-100 dark:bg-cyan-800/100 text-primary dark:text-white">
              <div className="px-1 py-1">
                {!loggedUser && (
                 <Menu.Item>
  {({ active }) => (
    <button
      onClick={() => navigate('/login')}
      className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-cyan-200 dark:bg-cyan-700' : 'hover:bg-cyan-400 dark:hover:bg-cyan-800 dark:text-white'}`}
    >
      Login
    </button>
  )}
</Menu.Item>

                )}
                <Menu.Item>
                  {({ active }) => (
                  <button onClick={() => navigate(`/profile/${loggedUser._id}`)}className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-cyan-200 dark:bg-cyan-700' : 'hover:bg-cyan-400 dark:hover:bg-cyan-800 dark:text-white'}`}>
  Profile
</button>

                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={handleLogout} className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-cyan-200 dark:bg-cyan-700' : 'hover:bg-cyan-400 dark:hover:bg-cyan-800 dark:text-white'}`}>
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default AdminMenu;
