import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Meteor } from 'meteor/meteor';

const UpdateMaritalStatus = () => {
  const [maritalStatus, setMaritalStatus] = useState('');

  const handleMaritalStatusUpdate = async (event) => {
    event.preventDefault();

    Meteor.call('userProfile.updateMaritalStatus', maritalStatus, (err) => {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong with updating the marital status!',
        });
      } else {
        Swal.fire('Success', 'Your marital status has been updated!', 'success');
      }
    });
  };

  return (
        <div>
            <h3>Marital Status</h3>
            <form onSubmit={handleMaritalStatusUpdate}>
                <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mb-4"
                >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                </select>
                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded">
                    Update Marital Status
                </button>
            </form>
        </div>
  );
};

export default UpdateMaritalStatus;
