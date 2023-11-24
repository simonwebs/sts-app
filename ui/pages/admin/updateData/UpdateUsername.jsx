import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateUsername = () => {
  const [username, setUsername] = useState('');

  const handleUsernameUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateUsername', username, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the username!',
        });
      } else {
        Swal.fire('Success', 'Your username has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Username</h3>
            <form onSubmit={handleUsernameUpdate}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Username
                </button>
            </form>
        </div>
  );
};

export default UpdateUsername;
