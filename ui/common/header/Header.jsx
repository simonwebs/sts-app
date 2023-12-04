import React, { useState, useEffect, Fragment } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useMediaQuery } from 'react-responsive';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PostsCollection } from '../../../api/collections/posts.collection';
import TimeSince from '../../components/TimeSince';

import {
  BookOpenIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UsersIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import UserMenu from './UserMenu';
import UserSearch from './UserSearch';
import NotificationBell from '../../auth/NotificationBell';

const engagement = [
  { name: 'About', href: '/about', icon: InformationCircleIcon },
  { name: 'Customers', href: '#', icon: UsersIcon },
  { name: 'Press', href: '/news', icon: NewspaperIcon },
  { name: 'Term & Condition', href: '/terms-and-conditions', icon: BriefcaseIcon },
  { name: 'Privacy', href: '/privacy', icon: ShieldCheckIcon },
]
const resources = [
  { name: 'Community', href: '#', icon: UserGroupIcon },
  { name: 'Partners', href: '#', icon: GlobeAltIcon },
  { name: 'Guides', href: '#', icon: BookOpenIcon },
  { name: 'Webinars', href: '#', icon: VideoCameraIcon },
]
const closeDropdown = () => {
  setIsDropdownOpen(false);
};

const Header = ({ theme, profileUserId }) => {
  const currentUser = useTracker(() => Meteor.user());
  const [darkMode, setDarkMode] = useState(false);
  const logoUrl = 'https://via.placeholder.com/150';
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const handleUserSelect = (user) => {
    // Open ChatWindow or perform other actions
    setSelectedUser(user);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cloud_name = 'swed-dev';
  const { posts, isLoading } = useTracker(() => {
    const postHandle = Meteor.subscribe('postsWithAuthors');
    const fetchedPosts = PostsCollection.find({}).fetch();
    const authorIds = fetchedPosts.map((post) => post.authorId);
    const authors = Meteor.users.find({ _id: { $in: authorIds } }).fetch();
    const postsWithAuthors = fetchedPosts.map((post) => {
      const author = authors.find((a) => a._id === post.authorId);
      return { ...post, author };
    });

    return {
      posts: postsWithAuthors,
      isLoading: !postHandle.ready(),
    };
  });

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

  const handlePostClick = (postId, categoryHref) => {
    closeDropdown();
    navigate(`/post/${postId}`);
  };
  const currentPosts = posts.slice(0, 5); // Adjust the range based on your requirements

  if (isLoading) {
    return <p>Loading...</p>;
  }


  return (
    <Popover className="relative isolate z-50">
      {/* ... existing code for top header section */}
 
      <div className="bg-white dark:bg-gray-700 pt-5">
        <div className="flex justify-between items-center mx-auto max-w-7xl px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" aria-label="Home">
              <img
                cloud_name={cloud_name}
                width="32"
                height="32"
                className="h-8 w-8 object-cover rounded-full border-2 border-gray-300"
                src={logoUrl}
                alt="Company logo"
                loading="lazy"
              />
            </Link>
          </div>
          <div className="flex-grow flex items-center justify-center space-x-2">
        <UserSearch />
        <Popover.Button
          className="inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 
          text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-offset-2 transition duration-300 ease-in-out bg-gradient-to-r from-pink-500
          via-purple-500 to-violet-600 hover:shadow-lg hover:from-pink-600 hover:to-violet-700"
        >
          Discover
          <ChevronDownIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
        </Popover.Button>
      </div>

          {/* Right content: Theme toggle and User menu */}
          <div className="flex items-center space-x-2">
          <NotificationBell profileUserId={profileUserId} />
            <button
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            <UserMenu user={currentUser} />
          </div>
        </div>
      </div>

      <Transition as={Fragment}>
        <Popover.Panel className="absolute inset-x-0 top-0 -z-10 bg-white dark:bg-gray-700 pt-16 shadow-lg ring-1 ring-gray-900/5">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-500">Engagement</h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                  {engagement.map((item) => (
  <NavLink
    key={item.name}
    to={item.href}
    onClick={() => {
      closeDropdown();
      navigate(item.href);
    }}
    className="flex gap-x-4 py-2 text-sm font-semibold leading-6 text-gray-900"
  >
    <item.icon className="h-6 w-6 flex-none text-gray-400" aria-hidden="true" />
    {item.name}
  </NavLink>
))}


                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-500">Resources</h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                  {resources.map((item) => (
  <NavLink
    key={item.name}
    to={item.href}
    onClick={() => {
      closeDropdown();
      navigate(item.href);
    }}
    className="flex gap-x-4 py-2 text-sm font-semibold leading-6 text-gray-900"
  >
    <item.icon className="h-6 w-6 flex-none text-gray-400" aria-hidden="true" />
    {item.name}
  </NavLink>
))}

                  </div>
                </div>
              </div>
            </div>
  {/* Recent Posts Section */}
  <div className="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2">
      <h3 className="sr-only">Recent posts</h3>
      {currentPosts.map((post) => (
        <article key={post._id} className="text-sm text-gray-700 dark:text-gray-400">
          <a
            href={`/post/${post._id}`}
            className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
            onClick={() => {
              closeDropdown();
            }}
          >
            <div className="relative flex-none">
              <img
                src={post.image}
                alt={post.caption}
                loading="lazy"
                className="aspect-[2/1] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[16/9] sm:h-32 lg:h-auto"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div>
              <div className="flex items-center gap-x-4">
                <span className="text-lg text-gray-700 dark:text-gray-400">
                  <TimeSince date={post.createdAt} />
                </span>
                <a
                  href={post.category.href}
                  onClick={(e) => {
                    e.preventDefault();
                    closeDropdown();
                  }}
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                >
                  {post.category}
                </a>
              </div>
              <h4 className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                <a href={`/post/${post._id}`}>
                  <span id='line-clamp-1' className="absolute inset-0" />
                  {post.caption}
                </a>
              </h4>
              <p id='line-clamp-1' className="mt-2 text-sm leading-6 text-gray-600">{post.description}</p>
            </div>
          </a>
        </article>
      ))}
    </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Header;