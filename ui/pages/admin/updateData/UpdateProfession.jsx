import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateProfession = () => {
  const [profession, setProfession] = useState('');

  const handleProfessionUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateProfession', profession, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the profession!',
        });
      } else {
        Swal.fire('Success', 'Your profession has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Profession</h3>
            <form onSubmit={handleProfessionUpdate}>
                <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Profession
                </button>
            </form>
        </div>
  );
};

export default UpdateProfession;
