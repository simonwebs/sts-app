import React from 'react';
import { FaRegSmile, FaBook, FaUtensils, FaPlane, FaMusic } from 'react-icons/fa';

const interestIcons = {
  hiking: <FaRegSmile />,
  reading: <FaBook />,
  cooking: <FaUtensils />,
  traveling: <FaPlane />,
  music: <FaMusic />,
  // Add more interests and corresponding icons as needed
};
const Interests = ({ formData, updateFormData }) => {
  const handleInterestToggle = (interest) => {
    const currentInterests = formData.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((item) => item !== interest)
      : [...currentInterests, interest];

    // Update form data with the new interests
    updateFormData({ interests: updatedInterests.map((item) => item.interestName || item) });
  };
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(interestIcons).map((interest) => (
          <button
            key={interest}
            type="button"
            className={`${
              formData?.interests?.includes(interest)
                ? `bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 text-white`
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
            } inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            onClick={() => handleInterestToggle(interest)}
          >
            {interestIcons[interest]}
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Interests;
