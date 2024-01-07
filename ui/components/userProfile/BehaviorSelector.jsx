import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'introverted', label: 'Introverted' },
  { value: 'extroverted', label: 'Extroverted' },
  { value: 'ambivert', label: 'Ambivert' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: '100%',
  }),
};

const BehaviorSelector = ({ selectedBehavior, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="behavior" className="block text-sm font-medium text-gray-700 mb-1">
        Behavior:
      </label>
      <Select
        id="behavior"
        options={options}
        value={options.find((option) => option.value === selectedBehavior)}
        onChange={(selectedOption) => onChange(selectedOption.value)}
        styles={customStyles}
        className="w-full"
      />
    </div>
  );
};

export default BehaviorSelector;
