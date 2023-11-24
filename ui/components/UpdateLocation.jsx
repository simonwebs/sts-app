import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateLocation = () => {
  const [location, setLocation] = useState('');

  const handleLocationUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateLocation', location, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the location!',
        });
      } else {
        Swal.fire('Success', 'Your location has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Location</h3>
            <form onSubmit={handleLocationUpdate}>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Location
                </button>
            </form>
        </div>
  );
};

export default UpdateLocation;
