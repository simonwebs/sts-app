import React, { useEffect, useState, useCallback } from 'react';
import { Bars3Icon } from '@heroicons/react/20/solid';
import GuestSearch from './GuestSearch';
import { NavLink } from 'react-router-dom';
import UserMenu from '../../../common/header/UserMenu';

const GuestHeader = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState('light');

  const handleThemeSwitch = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex justify-between w-full items-center dark:bg-gray-800 shadow-2xl z-10">
      <button 
        onClick={toggleSidebar} // Using toggleSidebar from props
        className="toggle-btn ml-5 text-gray-600 focus:outline-none"
      >
        <Bars3Icon className="w-6 h-6 dark:text-gray-200" />
      </button>

      <div className='ml-2'>
        <NavLink
            to="/"
            onClick={() => handleNavLinkClick(4)}
             className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Home
          </NavLink>
          </div>
      <GuestSearch />
      <div className="flex items-center space-x-4 m-2 mr-5">
        <button
          onClick={handleThemeSwitch}
          className="p-2 mr-5 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <UserMenu />
      </div>
    </div>
  );
};

export default GuestHeader;
