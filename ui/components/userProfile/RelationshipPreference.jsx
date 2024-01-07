import React from 'react';

const RelationshipPreference = ({ formData, updateFormData }) => {
  // Function to handle button click and update form data
  const handleButtonClick = (selectedRelationshipPreference) => {
    updateFormData({
      relationshipPreferences: {
        [selectedRelationshipPreference]: true,
      },
    });
  };

  // Rendering buttons for different relationship preferences
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['marriage', 'friendship', 'other'].map((relationshipPreference) => (
          <button
            key={relationshipPreference}
            type="button"
            className={`${
              formData?.relationshipPreferences?.[relationshipPreference]
                ? `bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 text-white`
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
            } rounded px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600`}
            onClick={() => handleButtonClick(relationshipPreference)}
          >
            {relationshipPreference.charAt(0).toUpperCase() + relationshipPreference.slice(1)}
          </button>
        ))}
      </div>
      {/* Add other relationshipPreference-related form inputs as needed */}
    </div>
  );
};

export default RelationshipPreference;
