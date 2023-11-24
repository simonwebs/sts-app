import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateGender = () => {
  const [gender, setGender] = useState('');

  const handleGenderUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateGender', gender, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the gender!',
        });
      } else {
        Swal.fire('Success', 'Your gender has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Gender</h3>
            <form onSubmit={handleGenderUpdate}>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Gender
                </button>
            </form>
        </div>
  );
};

export default UpdateGender;
