import React from 'react';

const InterestsSelector = ({ selectedInterests, onChange }) => {
  const interests = ['cooking', 'reading', 'gardening'];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Interests:</label>
      {interests.map((interest) => (
        <div key={interest} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={interest}
            value={interest}
            checked={selectedInterests.includes(interest)}
            onChange={(e) => onChange(interest, e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <label htmlFor={interest} className="ml-2 text-sm text-gray-700">
            {interest}
          </label>
        </div>
      ))}
    </div>
  );
};

export default InterestsSelector;
