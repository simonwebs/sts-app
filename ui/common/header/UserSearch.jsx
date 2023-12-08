// @ts-nocheck
// client/UserSearch.js
import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../../api/collections/UserProfiles'; // Import the UserProfiles collection

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
  const { isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('userProfilesSearch', searchQuery); // Subscribe with the searchQuery
    return {
      isLoading: !handle.ready(),
    };
  }, [searchQuery]);

  useEffect(() => {
    // Fetch user profiles that match the search criteria
    const searchResults = UserProfiles.find({
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { country: { $regex: searchQuery, $options: 'i' } },
        { city: { $regex: searchQuery, $options: 'i' } },
        // Add additional fields for matching here based on your schema
      ],
    }).fetch();

    setSuggestions(searchResults);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className=" relative shadow-3xl">
     <button
  aria-label="Toggle Search"
  className="flex items-center px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-opacity-75 transition duration-300 ml-3"
  onClick={() => setSearchOpen(!searchOpen)}
>
  <div className="p-1 border rounded-full">
    <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-100" />
  </div>
</button>

     {searchOpen && (
  <div className="fixed top-0 left-0 w-full h-full z-60">
    <div className="absolute w-full h-full bg-white/90 dark:bg-gray-700/90" onClick={() => setSearchOpen(false)}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-xl w-3/4 max-w-xl">
            <div className="p-3">
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
                  {suggestions.map((result) => (
                    <li key={result._id}>
                     <Link
  to={`/user/${result._id}`}
  className="hover:underline text-gray-700 dark:text-gray-200"
  onClick={() => setSearchOpen(false)}
>
  <p className="truncate w-64">{`${result.firstName} ${result.lastName}`}</p>
</Link>

                    </li>
                  ))}
                </ul>
                  )
                : (
                <p className="text-gray-600 dark:text-gray-400 mt-4">No results found.</p>
                  )}
            </div>
          </div>
        </div>
     )}
    </div>
  );
};

export default UserSearch;
