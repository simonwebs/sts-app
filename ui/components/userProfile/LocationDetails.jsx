import React from 'react';
import Select from 'react-select';

const LocationDetails = ({ formData, updateFormData, nextStep }) => {
  const handleSelectChange = (name, selectedOption) => {
    updateFormData({ [name]: selectedOption.value });
  };

  const countryOptions = [
    { value: 'usa', label: 'USA' },
    { value: 'canada', label: 'Canada' },
    // Add more countries as needed
  ];

  const cityOptions = [
    { value: 'new-york', label: 'New York' },
    { value: 'toronto', label: 'Toronto' },
    // Add more cities as needed
  ];

  return (
    <div>
      <div>
        <label htmlFor="country">Country:</label>
        <Select
          name="country"
          value={countryOptions.find((option) => option.value === formData?.country)}
          options={countryOptions}
          onChange={(selectedOption) => handleSelectChange('country', selectedOption)}
        />
      </div>

      <div>
        <label htmlFor="city">City:</label>
        <Select
          name="city"
          value={cityOptions.find((option) => option.value === formData?.city)}
          options={cityOptions}
          onChange={(selectedOption) => handleSelectChange('city', selectedOption)}
        />
      </div>
    </div>
  );
};

export default LocationDetails;
