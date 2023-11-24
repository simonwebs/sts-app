import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateTelephone = () => {
  const [telephone, setTelephone] = useState('');

  const handleTelephoneUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateTelephone', telephone, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the telephone!',
        });
      } else {
        Swal.fire('Success', 'Your telephone has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Telephone</h3>
            <form onSubmit={handleTelephoneUpdate}>
                <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Telephone
                </button>
            </form>
        </div>
  );
};

export default UpdateTelephone;
