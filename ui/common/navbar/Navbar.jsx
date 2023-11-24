import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const closeDropdown = () => {
      setDropdownVisible(false);
    };

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('click', closeDropdown);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('click', closeDropdown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavLinkClick = (index) => {
    setActiveLink(index);
  };

  return (
    <div className="bg-white dark:bg-gray-700">
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/20 dark:ring-gray-500/20 hover:ring-gray-900/20">
        <div className="flex justify-center items-center space-x-4 font-semibold dark:text-gray-200">
          <NavLink
            to="/"
            onClick={() => handleNavLinkClick(1)}
            className={`nav-link ${activeLink === 1 ? 'border-b-2 border-orange-600' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/news"
            onClick={() => handleNavLinkClick(2)}
            className={`nav-link ${activeLink === 2 ? 'border-b-2 border-orange-600' : ''}`}
          >
            News
          </NavLink>
     
          {/* Dropdown menu using Menu and Menu.Item */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                className="w-7 h-7 text-gray-600 dark:text-gray-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
                aria-label="Open options menu"  
              >
                <EllipsisVerticalIcon aria-hidden="true" />
              </Menu.Button>
            </div>
            {dropdownVisible && (
              <Menu.Items className="absolute right-0 mt-10 w-56 py-3 px-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-0"
                          style={{ zIndex: 50 }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to="/about"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-border-2-primary dark:hover:text-border-2-primary`}
                    >
                      About
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to="/contact-form"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-border-2-primary dark:hover:text-border-2-primary`}
                    >
                      Contact
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to="/news"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-border-2-primary dark:hover:text-border-2-primary`}
                    >
                     News
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to="#"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-border-2-primary dark:hover:text-border-2-primary`}
                    >
                     Silver
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to="#"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-border-2-primary dark:hover:text-border-2-primary`}
                    >
                     Gold
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to="#"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } dark:text-gray-200 hover:text-border-2-primary dark:hover:text-border-2-primary`}
                    >
                     Platimum
                    </NavLink>
                  )}
                </Menu.Item>
                {/* ... (other Menu.Item components) */}
              </Menu.Items>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
