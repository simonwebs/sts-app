import React from 'react';

const GuardianDetails = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Guardian Name</label>
        <input type="text" className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" name="guardianName" value={formData.guardianName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Address</label>
        <input type="text" className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" name="address" value={formData.address} onChange={handleChange} />
      </div>
    </div>
  );
};

export default GuardianDetails;
