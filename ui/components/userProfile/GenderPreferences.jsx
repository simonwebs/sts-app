import React from 'react';

const GenderPreferences = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  const renderCustomButtons = (name, options, excludeOption) => (
  <div className="flex mt-2 space-x-2 sm:space-x-4 md:space-x-6 justify-center items-center">
    {options
      .filter((option) => option !== excludeOption) // Exclude user's gender
      .map((option) => (
        <label key={option} className="inline-flex items-center">
          <input
            type="radio"
            className="hidden"
            name={name}
            value={option}
            checked={formData[name] === option}
            onChange={handleChange}
          />
          <div
            className={`bg-gray-200 dark:bg-gray-600 p-2 rounded-md px-2 py-1 text-sm font-semibold cursor-pointer transition-colors duration-300 dark:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500 ${
              formData[name] === option
? `bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 text-white`
: ''
            }`}
          >
            {option}
          </div>
        </label>
      ))}
  </div>
  );

  return (
    <div className="flex flex-col space-y-4 items-center">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
        {renderCustomButtons('lookingForGender', ['male', 'female', 'other', 'any'])}
      </div>

      <span className="text-md font-small mb-6 transition duration-300 ease-in-out bg-clip-text text-transparent bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 hover:from-pink-600 hover:to-violet-700">
        Height
      </span>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
        {renderCustomButtons('lookingForBodyHeight', ['short', 'tall', 'medium', 'any'])}
      </div>

      <span className="text-md font-small mb-6 transition duration-300 ease-in-out bg-clip-text text-transparent bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 hover:from-pink-600 hover:to-violet-700">
        Body type.
      </span>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
        {renderCustomButtons('lookingForBodyType', ['slim', 'thick', 'chubby', 'any'])}
      </div>
    </div>
  );
};

export default GenderPreferences;
