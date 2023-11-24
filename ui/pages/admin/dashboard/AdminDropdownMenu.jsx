import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const AdminDropdownMenu = ({ theme, dropdownOpen }) => {
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setLocalDropdownOpen(!localDropdownOpen);
  };
  return (
    <Menu as="div" className="relative inline-block text-left z-30 dark:bg-gray-800/100 shadow-2xl">
      <div>
        <Menu.Button
          className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-gray-700'} cursor-pointer pl-5`}
          onClick={toggleDropdown}
        >
          <span className="sr-only">Open options</span>
          <Bars3Icon aria-hidden="true" />
        </Menu.Button>
      </div>
      {dropdownOpen && (
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{ zIndex: 50 }}
          >
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/new-post"
                  className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-underline-primary dark:hover:text-underline-primary`}
                    >
                  Create post
                </Link>
              )}
            </Menu.Item>
             <Menu.Item>
              {({ active }) => (
                <Link
                  to="/news"
                  className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-underline-primary dark:hover:text-underline-primary`}
                    >
                  News
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/contact-form"
                  className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-underline-primary dark:hover:text-underline-primary`}
                    >
                  Contact
                </Link>
              )}
            </Menu.Item>
             <Menu.Item>
              {({ active }) => (
                <Link
                  to="/album"
                  className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-underline-primary dark:hover:text-underline-primary`}
                    >
                Album
                </Link>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
};
export default AdminDropdownMenu;
