import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useMediaQuery } from 'react-responsive';
import Loading from '../../components/spinner/Loading';

// Assume UserSearch, DropdownMenu, UserMenu, and Navbar are separate components
const UserSearch = React.lazy(() => import('../navbar/UserSearch'));
const DropdownMenu = React.lazy(() => import('../navbar/DropdownMenu'));
const UserMenu = React.lazy(() => import('../navbar/UserMenu'));
const Navbar = React.lazy(() => import('../navbar/Navbar'));

const Header = ({ theme }) => {
  const currentUser = useTracker(() => Meteor.user());
 const [darkMode, setDarkMode] = useState(false);

  const [logoUrl] = useState(
    'https://res.cloudinary.com/seyimsmultimedia/image/upload/v1699499831/seychelles-multimedia_y1zqrt.png',
  );

  // Responsive design using useMediaQuery hook from react-responsive
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };
  return (
    <Suspense fallback={<Loading name="Header" />}>
      <header
        role="banner"
        aria-label="Main header"
        className="bg-white dark:bg-gray-700 fixed top-0 w-full z-50 shadow"
      >
        <nav className="flex justify-between items-center h-16 w-full px-4">
          <div className="flex items-center space-x-2">
            <Link to="/" aria-label="Home">
              <img
                width="32"
                height="32"
                className="h-8 w-8 object-cover rounded-full border-2 border-gray-300"
                src={logoUrl}
                alt="Company logo"
                loading="lazy"
              />
            </Link>
            {/* Search component is always visible regardless of viewport size */}
            <UserSearch />
          </div>
          {!isMobile && <Navbar />}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            {!isMobile && <UserMenu user={currentUser} />
}
            <DropdownMenu theme={theme} user={undefined} />
          </div>
        </nav>
      </header>
    </Suspense>
  );
};

export default React.memo(Header);
