// @ts-nocheck
// client/UserSearch.js
import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useTracker } from 'meteor/react-meteor-data';
import { PostsCollection } from '../../../api/collections/posts.collection';
import { AlbumsCollection } from '../../../api/collections/AlbumsCollection';
import { CategoriesCollection } from '../../../api/collections/categories.collection';

const UserSearch = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    [],
  );
  const { posts, albums, categories, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('albumsWithAuthors', 20);
    return {
      posts: PostsCollection.find({}).fetch(),
      albums: AlbumsCollection.find({}).fetch(),
      categories: CategoriesCollection.find({}).fetch(),
      isLoading: !handle.ready(),
    };
  }, [searchQuery]);

  useEffect(() => {
    const typedPosts = posts.map(post => ({ ...post, type: 'post' }));
    const typedAlbums = albums.map(album => ({ ...album, type: 'album' }));
    const typedCategories = categories.map(category => ({ ...category, type: 'category' }));
    const searchResults = [...typedPosts, ...typedAlbums, ...typedCategories];
    const filteredResults = searchResults.filter(result =>
      result.caption.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filteredResults);
  }, [searchQuery, posts, albums, categories]);
  

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  return (
    <div className="user-search-container relative shadow-3xl">
     <button
  aria-label="Toggle Search"
  className="flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-opacity-75 transition duration-300 ml-5"
  onClick={() => setSearchOpen(!searchOpen)}
>
  <div className="p-1 border rounded-full">
    <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-100" />
  </div>
  <span className="text-gray-700 dark:text-gray-100 sm:hidden">Search</span>
</button>

     {searchOpen && (
  <div className="fixed top-0 left-0 w-full h-full z-60 mt-16">
    <div className="absolute w-full h-full bg-white/90 dark:bg-gray-700/90" onClick={() => setSearchOpen(false)}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-xl w-3/4 max-w-xl">
            <div className="p-6">
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  aria-label="Search" 
                  placeholder="Type and search..."
                  className="w-full py-2 px-4 shadow-sm rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:text-white dark:placeholder-gray-400 pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
  aria-label="Submit Search" 
  type="submit"
  className="absolute inset-y-0 right-0 flex items-center px-4 rounded-r-full bg-transparent"
>
  <div className="p-1 border rounded-full">
    <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
  </div>
</button>
              </div>
              {suggestions.length > 0 && searchQuery.length > 0
      ? (
        <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200 mt-4">
        {suggestions.length > 0 && searchQuery.length > 0
    ? (
      <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200 mt-4">
        {suggestions.map((result) => (
          <li key={result._id}>
            <Link
              to={`/${result.type === 'post' ? 'post' : result.type === 'album' ? 'album' : 'category'}/${result._id}`}
              className="hover:underline text-gray-700 dark:text-gray-200"
              onClick={() => setSearchOpen(false)}
            >
              <p className="truncate w-64">{result.caption}</p>
            </Link>
          </li>
        ))}
      </ul>
      )
    : (
    <p className="text-gray-600 dark:text-gray-400 mt-4">No results found.</p>
      )}
</ul>
        )
      : (
      <p className="text-gray-600 dark:text-gray-400 mt-4">No results found.</p>
        )}
        <button
                aria-label="Cancel Search"  // Added aria-label for accessibility
                onClick={() => setSearchOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
