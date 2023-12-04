import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Image } from 'cloudinary-react';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import Swal from 'sweetalert2';
import { FaSignInAlt } from 'react-icons/fa';


const UserMenu = ({ user }) => {
  const cloudName = 'swed-dev'; // Your actual cloud name
  const defaultImageId = 'https://via.placeholder.com/150'; // Your default image ID
  const profileImageId = user?.profile?.image || defaultImageId;

  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const navigate = useNavigate();
 
  const handleLogout = async () => {
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
          Swal.fire('Oops...', 'Error logging out! Please try again.', 'error');
        } else {
          navigate('/login');
        }
      });
    }
  };

  if (isLoadingLoggedUser) {
    return <p>Loading...</p>;
  }

  if (!loggedUser) {
    return (
      <button
  onClick={() => navigate('/login')}
  className="inline-flex items-center gap-x-2 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition duration-300 ease-in-out bg-gradient-to-r from-pink-600 via-violet-600 to-violet-600 hover:shadow-lg hover:from-pink-700 hover:to-violet-800"
>
  <FaSignInAlt className="w-5 h-5" /> 
  Signup
</button>
    );
  }
 

  return (
    <Menu as="div" className="relative inline-block text-left dark:bg-gray-700">
      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      {profileImageId && (
        <Image
          cloudName={cloudName}
          publicId={profileImageId}
          width="auto"
          crop="scale"
          quality="auto"
          fetchFormat="auto"
          secure={true}
          dpr="auto"
          responsive={true}
          className="w-8 h-8 rounded-full"
          alt="User profile image"
        />
      )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 dark:bg-gray-700 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate(`/profile/${loggedUser._id}`)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } group flex dark:text-white rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  Profile
                </button>
              )}
            </Menu.Item>
            {/* ... other menu items ... */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } group flex dark:text-white rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
