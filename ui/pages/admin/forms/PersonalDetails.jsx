import React from 'react';

const PersonalDetails = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Student Name</label>
        <input
          type="text"
          className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Gender</label>
        <select
          className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="other">Other</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div className="form-group">
  <label className='dark:text-gray-300'>Email</label>
  <input
    type="email"
    className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
    name="email"
    value={formData.email}
    onChange={handleChange}
  />
</div>

      <div className="form-group">
        <label className='dark:text-gray-300'>Date of Birth</label>
        <input
          type="date"
          className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label className='dark:text-gray-300'>Role</label>
        <select
          className="border rounded w-full px-4 py-2 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalDetails;
