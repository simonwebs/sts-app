import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import UserMenu from './UserMenu';



const DropdownMenu = ({ theme, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <Menu as="div" className="relative inline-block text-left z-30">
      <div>
       <Menu.Button
  className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-gray-700'} rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 md:hidden`}
  onClick={toggleDropdown}
>
  <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
  {isOpen ? (
    <XMarkIcon className="w-7 h-7 dark:stroke-white" aria-hidden="true" />
  ) : (
    <Bars3Icon className="w-7 h-7 dark:stroke-white" aria-hidden="true" />
  )}
</Menu.Button>

      </div>
      <Transition
        show={isOpen}
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
         <Menu.Items
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="py-1">
            {/* ... other menu items ... */}
          </div>

          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/"
                  className={`${
                    active ? 'bg-cyan-500 text-white' : 'text-gray-700 dark:text-gray-200'
                  } group flex items-center px-4 py-2 text-sm`}
                  onClick={closeDropdown} // Close the dropdown when item is clicked
                >
                  Home
                </Link>
              )}
            </Menu.Item>
             <Menu.Item>
              {({ active }) => (
                <Link
                  to="/about"
                  className={`${
                    active ? 'bg-cyan-500 text-white' : 'text-gray-700 dark:text-gray-200'
                  } group flex items-center px-4 py-2 text-sm`}
                  onClick={closeDropdown} // Close the dropdown when item is clicked
                >
                  About
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/news"
                  className={`${
                    active ? 'bg-cyan-500 text-white' : 'text-gray-700 dark:text-gray-200'
                  } group flex items-center px-4 py-2 text-sm`}
                  onClick={closeDropdown} // Close the dropdown when item is clicked
                >
                  News
                </Link>
              )}
            </Menu.Item>
             <Menu.Item>
              {({ active }) => (
                <Link
                  to="/contact-form"
                  className={`${
                    active ? 'bg-cyan-500 text-white' : 'text-gray-700 dark:text-gray-200'
                  } group flex items-center px-4 py-2 text-sm`}
                  onClick={closeDropdown} // Close the dropdown when item is clicked
                >
                  Contact Us
                </Link>
              )}
            </Menu.Item>
            <div className="py-1 m-3">
            {/* ... other menu items ... */}
            <UserMenu user={user} />
          </div>
      
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default React.memo(DropdownMenu);
