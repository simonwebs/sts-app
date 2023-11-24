import React from 'react';

const CustomInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="md:flex-1 p-2 border-2 border-gray-300 rounded-md"
    />
  );
};
export default CustomInput;
