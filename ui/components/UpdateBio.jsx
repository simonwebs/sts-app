import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateBio = () => {
  const [bio, setBio] = useState('');

  const handleBioUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateBio', bio, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the bio!',
        });
      } else {
        Swal.fire('Success', 'Your bio has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Bio</h3>
            <form onSubmit={handleBioUpdate}>
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Bio
                </button>
            </form>
        </div>
  );
};

export default UpdateBio;
