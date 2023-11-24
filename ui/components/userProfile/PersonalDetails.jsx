import React from 'react';

const PersonalDetails = ({ formData, updateFormData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        className="border-2 rounded-lg p-2"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        className="border-2 rounded-lg p-2"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        className="border-2 rounded-lg p-2"
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        placeholder="Birth Date"
      />
      <input
        className="border-2 rounded-lg p-2"
        type="text"
        name="bodyHeight"
        value={formData.bodyHeight}
        onChange={handleChange}
        placeholder="Height (cm)"
      />
       <div className="flex gap-2">
        {['male', 'female', 'other'].map((gender) => (
          <label key={gender} className="flex items-center gap-2">
            <input
              type="radio"
              name="biologicalGender"
              value={gender}
              checked={formData.biologicalGender === gender}
              onChange={handleChange}
              className="form-radio"
            />
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </label>
        ))}
      </div>

      <textarea
        className="w-full p-2 border rounded"
        name="personalBio"
        placeholder="A short bio about yourself"
        value={formData.personalBio}
        onChange={handleChange}
      />
    </div>
  );
};

export default PersonalDetails;
