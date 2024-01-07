import React from 'react';

const PersonalDetails3 = ({ formData, updateFormData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  return (
    <div>
      <div className="mb-4">
        <label htmlFor="bodyHeight" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
          Height (cm)
        </label>
        <div className="relative mt-2">
          <input
            type="text"
            id="bodyHeight"
            name="bodyHeight"
            className="peer block w-full border-0 bg-gray-50 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-300 focus:outline-none focus:border-lime-500 focus:ring focus:ring-cyan-200 dark:focus:ring-lime-700"
            value={formData.bodyHeight}
        onChange={handleChange}
        placeholder="Height (cm)"
          />
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-lime-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="personalBio" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
          Personal Bio
        </label>
        <div className="relative mt-2">
          <textarea
            id="personalBio"
            name="personalBio"
            className="peer block w-full border-0 bg-gray-50 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-300 focus:outline-none focus:border-lime-500 focus:ring focus:ring-cyan-200 dark:focus:ring-lime-700"
            placeholder="A short bio about yourself"
            value={formData.personalBio}
        onChange={handleChange}
          />
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-lime-600"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails3;
