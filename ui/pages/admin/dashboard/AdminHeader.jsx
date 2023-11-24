import React, { useState, useEffect, useCallback, lazy } from 'react';
import AdminSearch from './AdminSearch';
import { NavLink } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/20/solid';

const AdminMenu = lazy(() => import('./AdminMenu'));

const AdminHeader = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState('light');
  const handleThemeSwitch = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
       <div className="flex justify-between w-full items-center bg-cyan-700/100 dark:bg-cyan-800 shadow-2xl z-10">
   <button 
        onClick={toggleSidebar} // Using toggleSidebar from props
        className="toggle-btn ml-5 text-gray-600 focus:outline-none"
      >
        <Bars3Icon className="w-6 h-6 text-white dark:text-gray-200" />
      </button>
     <div className='ml-2'>
        <NavLink
            to="/"
            onClick={() => handleNavLinkClick(4)}
             className="flex-none rounded-md bg-cyan-500/100 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:700/100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-800/100"
          >
            Home
          </NavLink>
          </div>
        <AdminSearch />
        <div className="flex items-center space-x-4 m-2 mr-5">
          <button
            onClick={handleThemeSwitch}
            className="p-2 mr-5 rounded-full text-gray-600 dark:text-gray-200 hover:bg-cyan-200 dark:hover:bg-cyan-700"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <AdminMenu />
        </div>
      </div>
  );
};

export default AdminHeader;
 