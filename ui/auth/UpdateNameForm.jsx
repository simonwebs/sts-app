// UpdateNameForm.js
import React, { useState } from 'react';

const UpdateNameForm = ({ currentName, onCancel, onUpdate }) => {
  const [newName, setNewName] = useState(currentName);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(newName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={newName}
        onChange={handleNameChange}
        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded focus:outline-none">
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="ml-2 text-blue-500 hover:underline focus:outline-none"
      >
        Cancel
      </button>
    </form>
  );
};

export default UpdateNameForm;
