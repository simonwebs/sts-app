import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { SettingsCollection } from '../../../../api/collections/SettingsCollection';
import Swal from 'sweetalert2';

const SettingPage = () => {
  const { settings: fetchedSettings } = useTracker(() => {
    const handle = Meteor.subscribe('userSettings');
    const settings = SettingsCollection.findOne({ userId: Meteor.userId() }) || {};
    return {
      settings,
      isLoading: !handle.ready(),
    };
  });

  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
    color: '#000000',
    username: '',
    displayDataToPublic: false,
    allowOthersToSeePost: false,
    allowOthersToReact: false,
    ...fetchedSettings,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle file change
  };
  const handleUsernameChange = (newUsername) => {
    Meteor.call('updateUsername', newUsername, (error) => {
      if (error) {
        Swal.fire('Error', error.reason, 'error');
      } else {
        Swal.fire('Success', 'Username updated successfully', 'success');
      }
    });
  };
  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (settings.username.length < 3) {
      Swal.fire('Error', 'Username must be at least 3 characters', 'error');
      return;
    }

    // Update username
    handleUsernameChange(settings.username);

    // Update other settings
    Meteor.call('updateUserSettings', settings, (error) => {
      if (error) {
        Swal.fire('Error', error.reason, 'error');
      } else {
        Swal.fire('Success', 'Settings updated successfully', 'success');
      }
    });
  };

  return (
  <div className='bg-white dark:bg-gray-700/100 p-5'>
    <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">Settings</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Accept Notifications:</p>
          <input
            id="notifications"
            name="notifications"
            type="checkbox"
            checked={settings.notifications}
            onChange={handleInputChange}
            className="form-checkbox w-5 h-5"
          />
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Theme:</p>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleInputChange}
            className="w-30 md:w-1/3 rounded dark:bg-gray-700 dark:text-white text-gray-700 shadow-md border-0 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Color:</p>
          <input
            id="color"
            name="color"
            type="color"
            value={settings.color}
            onChange={handleInputChange}
             className="form-checkbox  md w-8 h-5"
          />
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Profile Picture:</p>
          <div className="w-full md:w-1/3 flex items-center">
            <button type="button" onClick={() => document.getElementById('profilePicture').click()} className="peer block w-full md:w-1/3 rounded shadow-md border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6">Choose File</button>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Username:</p>
          <input
            id="username"
            name="username"
            type="text"
            value={settings.username}
            onChange={handleInputChange}
            className="peer block dark:bg-gray-700 dark:text-white text-gray-700 w-full md:w-1/3 rounded shadow-md border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Jane Smith"
          />
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Display Data To Public:</p>
          <input
            id="displayDataToPublic"
            name="displayDataToPublic"
            type="checkbox"
            checked={settings.displayDataToPublic}
            onChange={handleInputChange}
            className="form-checkbox w-5 h-5"
          />
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Allow Others To See Post:</p>
          <input
            id="allowOthersToSeePost"
            name="allowOthersToSeePost"
            type="checkbox"
            checked={settings.allowOthersToSeePost}
            onChange={handleInputChange}
            className="form-checkbox w-5 h-5"
          />
        </div>
        <div className="flex items-center">
          <p className="w-1/3 dark:text-white text-gray-700">Allow Others To React:</p>
          <input
            id="allowOthersToReact"
            name="allowOthersToReact"
            type="checkbox"
            checked={settings.allowOthersToReact}
            onChange={handleInputChange}
            className="form-checkbox w-5 h-5"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default SettingPage;
