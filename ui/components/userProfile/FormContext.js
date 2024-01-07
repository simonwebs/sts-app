// FormContext.js
import React, { createContext, useContext, useReducer } from 'react';

const FormContext = createContext();

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    // Handle other actions as needed
    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  const initialState = {
    formData: {
      firstName: '',
      lastName: '',
      birthDate: '',
      bodyHeight: '',
      biologicalGender: '',
      personalBio: '',
      lookingForGender: '',
      lookingForBodyHeight: '',
      lookingForBodyType: '',
      agePreferenceMin: '',
      agePreferenceMax: '',
      country: '',
      city: '',
      profilePhotos: [],
    },
    step: 1,
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={[state, dispatch]}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
