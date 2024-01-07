import React from 'react';

const PersonalDetails = ({ formData, updateFormData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  return (
    <div>
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
          First Name
        </label>
        <div className="flex items-center justify-center">
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="peer block w-full border-0 bg-gray-50 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-300 focus:outline-none focus:border-cyan-500 focus:ring focus:ring-cyan-200 dark:focus:ring-cyan-700"
            placeholder="Enter your first name"
            value={formData.firstName}
        onChange={handleChange}
          />
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="lastName" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
          Last Name
        </label>
        <div className="relative mt-2">
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="peer block w-full border-0 bg-gray-50 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-300 focus:outline-none focus:border-cyan-500 focus:ring focus:ring-cyan-200 dark:focus:ring-cyan-700"
            placeholder="Enter your last name"
           value={formData.lastName}
        onChange={handleChange}
          />
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
