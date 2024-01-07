import React from 'react';
import Select from 'react-select';

const AgePreference = ({ formData, updateFormData }) => {
  const handleSelectChange = (name, selectedOption) => {
    updateFormData({ [name]: selectedOption?.value || null });
  };

  const ageOptions = [
    { value: 18, label: '18' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 80, label: '80' },
    // Add more age options as needed
  ];

  return (
    <div>

      <div>
        <label htmlFor="agePreferenceMin">Age Preference Min:</label>
        <Select
          name="agePreferenceMin"
          value={ageOptions.find((option) => option.value === formData?.agePreferenceMin)}
          options={ageOptions}
          onChange={(selectedOption) => handleSelectChange('agePreferenceMin', selectedOption)}
        />
      </div>

      <div>
        <label htmlFor="agePreferenceMax">Age Preference Max:</label>
        <Select
          name="agePreferenceMax"
          value={ageOptions.find((option) => option.value === formData?.agePreferenceMax)}
          options={ageOptions}
          onChange={(selectedOption) => handleSelectChange('agePreferenceMax', selectedOption)}
        />
      </div>
    </div>
  );
};

export default AgePreference;
