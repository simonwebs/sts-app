import React from 'react';

const Behavior = ({ formData, updateFormData }) => {
  const handleButtonClick = (selectedBehavior) => {
    // Update the behavior field as an object
    updateFormData({ behavior: { behavior: selectedBehavior } });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['introverted', 'extroverted', 'ambivert'].map((behavior) => (
          <button
            key={behavior}
            type="button"
            className={`${
              formData?.behavior?.behavior === behavior
                ? `bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 text-white`
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
            } rounded px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600`}
            onClick={() => handleButtonClick(behavior)}
          >
            {behavior.charAt(0).toUpperCase() + behavior.slice(1)}
          </button>
        ))}
      </div>
      {/* Add other behavior-related form inputs as needed */}
    </div>
  );
};

export default Behavior;
