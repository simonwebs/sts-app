import React from 'react';

const GenderButton = ({ gender, isSelected, onChange }) => (
  <button
    type="button"
    className={`rounded-full px-4 py-2 ${
      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
    }`}
    onClick={() => onChange(gender)}
  >
    {gender}
  </button>
);

export default GenderButton;
