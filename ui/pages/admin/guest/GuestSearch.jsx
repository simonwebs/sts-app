import React, { useState, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

const GuestSearch = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value) {
        Meteor.call('searchPosts', value, (error, results) => {
          if (error) {
            console.error('Error fetching search results:', error);
          } else {
            setSearchResults(results);
          }
        });
      } else {
        setSearchResults([]);
      }
    }, 300),
    [],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  
  return (
     <div className="user-search-container relative">
      <button
        className="flex items-center px-4 py-2 rounded-full bg-transparent dark:bg-gray-800/100 text-gray-700 dark:text-white hover:bg-opacity-75 transition duration-300 ml-5"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <MagnifyingGlassIcon className="h-5 w-5 mr-2 stroke-2 text-gray-700 dark:text-gray-100" />
        <span className="text-gray-700 dark:text-gray-100 sm:hidden">Search</span>
      </button>

      {searchOpen && (
       <div className="fixed top-0 left-0 w-full h-full z-60">
         <div className="absolute w-full h-full bg-black opacity-50" onClick={() => setSearchOpen(false)}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-xl">
            <div className="p-6">
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Type and search..."
                  className="w-full py-2 px-4 shadow-sm rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700 focus:ring-opacity-50 dark:text-white dark:placeholder-gray-400 pl-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center px-4 rounded-r-full bg-transparent"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              {searchResults.length > 0
                ? (
                <ul className="list-disc pl-6 text-gray-800 dark:text-gray-200 mt-4">
                  {searchResults.map((result) => (
                    <li key={result._id}>
                      <Link
                        to={`/post/${result._id}`}
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
              <button
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
export default GuestSearch;
