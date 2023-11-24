import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';

const AddAdminForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    Meteor.call('createAdminUser', email, name, (error) => {
      setIsLoading(false);
      if (error) {
        Swal.fire('Error', error.reason, 'error');
      } else {
        Swal.fire('Success', 'Admin created successfully.', 'success');
        setEmail('');
        setName('');
      }
    });
  };

  //console.log('Is user logged in?', !!Meteor.userId());

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl mb-4">Add Admin User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border rounded-md"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
            >
              {isLoading ? 'Creating...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminForm;
