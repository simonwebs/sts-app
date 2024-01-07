import React from 'react';

const CustomButton = ({ children, onClick, selected }) => (
  <button
    type="button"
    className={`custom-select-button ${
      selected ? 'bg-violet-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
    } px-4 py-2 rounded-lg font-medium`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default CustomButton;
