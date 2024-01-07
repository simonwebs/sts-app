import React from 'react';

const PersonalDetails2 = ({ formData, updateFormData, nextStep }) => {
  const handleGenderChange = (gender) => {
    updateFormData({ biologicalGender: gender });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <label htmlFor="birthDate" className="items-center justify-center block text-gray-700 dark:text-white text-sm font-bold mb-2">
          Birth Date
        </label>
        <div className="relative mt-2">
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            className="peer block w-full border-0 bg-gray-50 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-300 focus:outline-none focus:border-cyan-500 focus:ring focus:ring-cyan-200 dark:focus:ring-cyan-700"
            placeholder="Select your birth date"
            value={formData.birthDate}
            onChange={(e) => updateFormData({ birthDate: e.target.value })}
          />
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mb-6 mt-4">
        <label htmlFor="biologicalGender" className="flex items-center justify-center block text-gray-700 dark:text-white text-sm font-bold mb-2">
          Biological Gender
        </label>
        <div className="flex gap-4 flex items-center justify-center">
          {['male', 'female', 'other'].map((gender) => (
            <button
              key={gender}
              type="button"
              className={`${
                formData.biologicalGender === gender
                  ? `bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 text-white`
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
              } rounded px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
              onClick={() => handleGenderChange(gender)}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails2;
