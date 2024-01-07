import React from 'react';

const Disability = ({ formData, updateFormData, nextStep }) => {
  const handleChange = (value) => {
    updateFormData({ hasDisability: value });
  };

  const handleDisabilityDescriptionChange = (e) => {
    updateFormData({ disabilityDescription: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto my-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow-md">
      <div className="mb-6 lex mb-2 items-center justify-center">
        <label htmlFor="hasDisability" className="block text-gray-700 dark:text-white text-sm font-bold mb-4 flex items-center justify-center">
          Do you have a disability?
        </label>
        <div className="flex items-center justify-center gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasDisability"
              value="yes"
              checked={formData.hasDisability === true}
              onChange={() => handleChange(true)}
              className="peer sr-only"
            />
            <div className={`bg-${formData.hasDisability ? 'green' : 'gray'}-500 p-2 rounded-md cursor-pointer text-white`}>
              Yes
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasDisability"
              value="no"
              checked={formData.hasDisability === false}
              onChange={() => handleChange(false)}
              className="peer sr-only"
            />
            <div className={`bg-${formData.hasDisability ? 'gray' : 'green'}-500 p-2 rounded-md cursor-pointer text-white`}>
              No
            </div>
          </label>
        </div>
      </div>
      {formData.hasDisability && (
        <div className="mb-6">
          <label htmlFor="disabilityDescription" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Describe your disability:
          </label>
          <div className="relative mt-2">
            <textarea
              id="disabilityDescription"
              name="disabilityDescription"
              rows="4"
              className="peer block w-full border-0 bg-gray-50 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-300 focus:outline-none focus:border-cyan-500 focus:ring focus:ring-cyan-200 dark:focus:ring-cyan-700"
              placeholder="Enter a description of your disability"
              value={formData.disabilityDescription || ''}
              onChange={handleDisabilityDescriptionChange}
            />
            <div
              className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Disability;
