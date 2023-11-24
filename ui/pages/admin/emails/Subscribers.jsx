import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NewsletterCollection } from '../../../../api/collections/NewsletterCollection';
import { FiTrash, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const Subscribers = () => {
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const subscribers = useTracker(() => {
    Meteor.subscribe('allNewsletters');
    return NewsletterCollection.find().fetch();
  }, []);

  const filteredSubscribers = searchTerm
    ? subscribers.filter(subscriber =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : subscribers;

  const handleSearchChange = event => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm) {
      const newSuggestions = subscribers.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchClick = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleSuggestionClick = suggestion => {
    setSearchTerm(suggestion.email);
    setSuggestions([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(subscriber => subscriber._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectSubscriber = (id) => {
    setSelectedSubscribers(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(subscriberId => subscriberId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const deleteSubscriber = (id) => {
    Meteor.call('newsletter.removeMultiple', [id], (error) => {
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.reason,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Subscriber has been removed.',
        });
      }
    });
  };

  const deleteSelectedSubscribers = () => {
    setDeleteLoading(true);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the selected subscribers.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        Meteor.call('newsletter.removeMultiple', selectedSubscribers, (error) => {
          setDeleteLoading(false);
          if (error) {
            console.error('Failed to delete subscribers:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Failed to delete subscribers.',
            });
          } else {
            setSelectedSubscribers([]);
            Swal.fire(
              'Deleted!',
              'Selected subscribers have been deleted.',
              'success',
            );
          }
        });
      }
    });
  };

  const sendEmailToSelected = () => {
    setEmailLoading(true);
    Swal.fire({
      title: 'Write your email content',
      input: 'textarea',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      showLoaderOnConfirm: true,
      preConfirm: (message) => {
        return new Promise((resolve, reject) => {
          Meteor.call('sendEmailToSelectedSubscribers', selectedSubscribers, message, (error, response) => {
            setEmailLoading(false);
            if (error) {
              reject(error.reason || 'Failed to send emails');
            } else {
              resolve(response);
            }
          });
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedSubscribers([]);
        Swal.fire({
          icon: 'success',
          title: 'Sent!',
          text: 'Your message has been sent to the selected subscribers.',
        });
      }
    });
  };

  return (
    <div className='bg-white dark:bg-gray-800/100 p-4 sm:p-6 lg:p-8'>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <h2 className="text-lg font-bold mb-2 sm:mb-0 dark:text-gray-200">Total Subscribers: {filteredSubscribers.length}</h2>
        <div className="relative flex border border-gray-300 rounded w-full sm:w-auto">

          <input
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-1 rounded-md w-full dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSearchClick}
            className="p-1 bg-gray-100 dark:bg-gray-700 rounded-r"
          >
            <FiSearch className='w-6 h-6 dark:text-white'/>
          </button>
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 mt-12 rounded-md shadow-sm z-10">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer mt-4" onClick={() => handleSuggestionClick(suggestion)}>
                  <div className="mr-2 text-gray-500"/>
                  <span dangerouslySetInnerHTML={{
                    __html: suggestion.email.replace(
                      new RegExp(searchTerm, 'gi'),
                      (match) => `<span class='font-bold'>${match}</span>`,
                    ),
                  }} />
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
      <button
        onClick={sendEmailToSelected}
        className="mb-4 p-1 bg-primary dark:bg-gray-600 text-white rounded"
        disabled={emailLoading}
      >
        {emailLoading ? 'Loading...' : 'Write & Send Email'}
      </button>

      <button
        onClick={deleteSelectedSubscribers}
        className="mb-4 p-1 bg-red-500 text-white rounded ml-4"
        disabled={selectedSubscribers.length === 0 || deleteLoading}
      >
        {deleteLoading ? 'Loading...' : 'Delete Selected'}
      </button>

      <ul role="list" className="divide-y divide-gray-100">
        <li className="flex justify-between gap-x-6 py-3">
          <div className="flex items-center gap-x-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <div className="min-w-0 flex-auto font-bold dark:text-gray-200">
              Select All
            </div>
          </div>
        </li>
       {filteredSubscribers.length > 0
         ? (
             filteredSubscribers.map((subscriber) => (
              <li key={subscriber._id} className="flex justify-between gap-x-6 py-3">
                <div className="flex items-center gap-x-4">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.includes(subscriber._id)}
                    onChange={() => toggleSelectSubscriber(subscriber._id)}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-400">{subscriber?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-4">
                  <time dateTime={subscriber.createdAt} className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {formatDate(subscriber.createdAt)}
                  </time>
                  {selectedSubscribers.includes(subscriber._id) &&
                    <button
                      onClick={() => deleteSubscriber(subscriber._id)}
                      className="p-2 bg-red-500 text-white rounded"
                    >
                      <FiTrash />
                    </button>
                  }
                </div>
              </li>
             ))
           )
         : (
            <li className="flex justify-between gap-x-6 py-3">
              <div className="min-w-0 flex-auto">
                <p className="mt-1 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                  No subscribers yet.
                </p>
              </div>
            </li>
           )
        }
      </ul>
    </div>
  );
};

export default Subscribers;
