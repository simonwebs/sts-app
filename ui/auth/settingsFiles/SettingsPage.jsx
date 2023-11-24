import React, { useState, lazy } from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';

const ColorChange = lazy(() => import('./ColorChange'));
const NotificationToggle = lazy(() => import('./NotificationToggle'));
const MainContent = lazy(() => import('./MainContent'));

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [color, setColor] = useState('#000000');
  const [notifications, setNotifications] = useState(true);
  const [showAside, setShowAside] = useState(false);

  const handleUsernameUpdate = async (event) => {
    event.preventDefault();
    Meteor.call('users.updateUsername', username, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the username!',
        });
        // console.error(err);
        return;
      }
      Swal.fire('Success', 'Your username has been updated!', 'success');
    });
  };

  const handleColorChange = async (event) => {
    event.preventDefault();
    Meteor.call('users.updateColor', color, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the color!',
        });
        // console.error(err);
      } else {
        Swal.fire('Success', 'Your color preference has been updated!', 'success');
      }
    });
  };
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProfileImageUpload = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      console.error('No file selected!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];

      Meteor.call('users.uploadProfileImage', base64String, (error, result) => {
        if (error) {
         // console.error('Error updating profile image:', error);
        } else {
         // console.log('Profile image updated successfully');
        }
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className='flex flex-col lg:flex-row'>
      <button
        onClick={() => setShowAside(!showAside)}
        className='lg:hidden p-4 mb-4 bg-primary text-white rounded'
      >
        {showAside ? 'Hide Menu' : 'Show Menu'}
      </button>
      <main className='w-full lg:w-3/4 p-8'>
        <NotificationToggle notifications={notifications} setNotifications={setNotifications} />
        <ColorChange color={color} setColor={setColor} />
      <button type="submit" className='bg-primary text-white p-2 rounded-md mt-2' onClick={handleColorChange}>Update Color</button>

        <form onSubmit={handleUsernameUpdate} className='mt-8 dark:bg-gray-700'>
          <label className='block mb-2 text-gray-700'>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="New username"
            className="block w-full rounded-full border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
          <button type="submit" className='bg-primary text-white p-2 rounded-md mt-2'>Update Username</button>
        </form>

        <form onSubmit={handleProfileImageUpload} className="mt-8">
          <label className='block mb-2 text-gray-700'>Profile Image</label>
          <input type="file" onChange={handleFileSelect} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">Update Profile Image</button>
        </form>

        <MainContent />
      </main>
    </div>
  );
};
export default SettingsPage;
