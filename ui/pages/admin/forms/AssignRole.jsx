import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const AssignRole = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = () => {
    Meteor.call('superAdmin.assignRole', email, role, (err, res) => {
      if (err) {
        alert('Error');
      } else {
        alert('Role assigned');
      }
    });
  };

  return (
    <div>
      <h1>Assign Role</h1>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Role" onChange={(e) => setRole(e.target.value)} />
      <button onClick={handleSubmit}>Assign Role</button>
    </div>
  );
};

export default AssignRole;
