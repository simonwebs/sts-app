import React, { createContext, useContext } from 'react';

const ValidationContext = createContext();

export const useValidation = () => {
  return useContext(ValidationContext);
};

export const ValidationProvider = ({ children, validateFunction }) => {
  return (
    <ValidationContext.Provider value={validateFunction}>
      {children}
    </ValidationContext.Provider>
  );
};
