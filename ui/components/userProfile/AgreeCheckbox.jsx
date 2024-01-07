import React from 'react';

const AgreeCheckbox = ({ checked, onChange }) => {
  return (
    <div>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        I agree to the terms and conditions
      </label>
    </div>
  );
};

export default AgreeCheckbox;
