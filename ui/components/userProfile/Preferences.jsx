import React from 'react';

const  Preferences = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        Looking for Gender:
        <div className="flex mt-2">
          {['male', 'female', 'other', 'any'].map((gender) => (
            <label key={gender} className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio"
                name="lookingForGender"
                value={gender}
                checked={formData.lookingForGender === gender}
                onChange={handleChange}
              />
              <span className="ml-2 capitalize">{gender}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        Preferred Age Range:
        <div className="flex space-x-3 mt-2">
          <input
            type="number"
            className="border-2 rounded-lg p-2"
            name="agePreferenceMin"
            value={formData.agePreferenceMin}
            onChange={handleChange}
            placeholder="Min Age"
          />
          <input
            type="number"
            className="border-2 rounded-lg p-2"
            name="agePreferenceMax"
            value={formData.agePreferenceMax}
            onChange={handleChange}
            placeholder="Max Age"
          />
        </div>
      </div>

      <div>
        Preferred Body Height:
        <select
          className="border-2 rounded-lg p-2 mt-2"
          name="lookingForBodyHeight"
          value={formData.lookingForBodyHeight}
          onChange={handleChange}
        >
          {['short', 'tall', 'medium', 'any'].map((height) => (
            <option key={height} value={height} className="capitalize">
              {height}
            </option>
          ))}
        </select>
      </div>

      <div>
        Preferred Body Type:
        <select
          className="border-2 rounded-lg p-2 mt-2"
          name="lookingForBodyType"
          value={formData.lookingForBodyType}
          onChange={handleChange}
        >
          {['slim', 'thick', 'chubby', 'any'].map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default  Preferences;
