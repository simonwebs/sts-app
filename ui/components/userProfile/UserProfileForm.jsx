import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import PersonalDetails from './PersonalDetails';
import clsx from 'clsx';
import LocationDetails from './LocationDetails';
import PersonalDetails2 from './PersonalDetails2';
import PersonalDetails3 from './PersonalDetails3';
import GenderPreferences from './GenderPreferences';
import AgePreference from './AgePreference';
import Behavior from './Behavior';
import Disability from './Disability';
import Interests from './Interests';
import RelationshipPreference from './RelationshipPreference';
import AgreeCheckbox from './AgreeCheckbox';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProgressBar from './ProgressBar';

// Step names array
const stepNames = [
  'Personal Details',
  'Personal Details 2',
  'Personal Details 3',
  'Location Details',
  'Disability',
  'Behavior',
  'Interests',
  'Gender Preferences',
  'Age Preference',
  'Relationship Preference',
  'Terms and Conditions',
];

const UserProfileForm = () => {
  const totalSteps = 11; // Reduced total steps since photos are removed

  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // New state for agreement

  const [formData, setFormData] = useState({
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
    profileCreatedAt: new Date(),
    agreedToTerms: false,
    relationshipPreferences: {
      marriage: false,
      friendship: false,
    },
    disability: {
      hasDisability: false,
      disabilityDescription: '',
    },
    behavior: {
      behavior: '',
    },
    interests: [],
    likedByUsers: [],
    matches: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

  const navigate = useNavigate();

  // Validation functions for each step
  const validatePersonalDetails = () => {
    const { firstName, lastName } = formData;
    return firstName.trim() !== '' && lastName.trim() !== '';
  };
  const validatePersonalDetails2 = () => {
    const { birthDate, biologicalGender } = formData;

    if (birthDate.trim() === '') {
    // Display error modal if birthDate is empty
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter your birth date.',
      });
      return false;
    }

    const userBirthDate = new Date(birthDate);
    const today = new Date();

    // Calculate age
    const age = today.getFullYear() - userBirthDate.getFullYear();
    const monthDiff = today.getMonth() - userBirthDate.getMonth();
    const dayDiff = today.getDate() - userBirthDate.getDate();

    // Check if the user is under 18 or if the birthdate is in the future
    if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
    // Display error modal if the user is under 18 or birthdate is in the future
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'You must be 18 years or older to proceed.',
      });
      return false;
    }

    if (biologicalGender.trim() === '') {
    // Display error modal if biologicalGender is not selected
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select your biological gender.',
      });
      return false;
    }

    return true;
  };

  const validatePersonalDetails3 = () => {
    const { bodyHeight, personalBio } = formData;
    return bodyHeight.trim() !== '' && personalBio.trim() !== '';
  };
  const validateLocationDetails = () => {
    const { country, city } = formData;
    return country.trim() !== '' && city.trim() !== '';
  };
  const validateDisability = () => {
    const { hasDisability, disabilityDescription } = formData;
    return hasDisability && disabilityDescription.trim() !== '';
  };
  const validateBehavior = () => {
    const { behavior } = formData;
    return behavior && behavior.behavior && behavior.behavior.trim() !== '';
  };

  const validateGenderPreferences = () => {
    const { lookingForGender, lookingForBodyHeight, lookingForBodyType } = formData;

    return (
      lookingForGender &&
      lookingForBodyHeight &&
      lookingForBodyType &&
      lookingForGender.trim() !== '' &&
      lookingForBodyHeight.trim() !== '' &&
      lookingForBodyType.trim() !== ''
    );
  };
  const validateAgePreference = () => {
    const { agePreferenceMin, agePreferenceMax } = formData;

    return (
      agePreferenceMin !== null &&
      agePreferenceMax !== null &&
      !isNaN(agePreferenceMin) &&
      !isNaN(agePreferenceMax) &&
      Number(agePreferenceMin) >= 0 &&
      Number(agePreferenceMax) >= 0 &&
      Number(agePreferenceMin) <= Number(agePreferenceMax)
    );
  };
  const validateRelationshipPreference = () => {
    const { marriage, friendship } = formData.relationshipPreferences;
    return marriage || friendship;
  };
  const validateAgreeCheckbox = () => {
    return agreedToTerms;
  };

  const validateInterests = () => {
    const { interests } = formData;
    return (
      Array.isArray(interests) &&
    interests.every((interest) => typeof interest === 'string' && interest.trim() !== '')
    );
  };

  const handleNextStep = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validatePersonalDetails();
        break;
      case 2:
        isValid = validatePersonalDetails2();
        break;
      case 3:
        isValid = validatePersonalDetails3();
        break;
      case 4:
        isValid = validateLocationDetails();
        break;
      case 5:
        isValid = validateDisability();
        break;
      case 6:
        isValid = validateBehavior();
        break;
      case 7:
        isValid = validateInterests();
        break;
      case 8:
        isValid = validateGenderPreferences();
        break;
      case 9:
        isValid = validateAgePreference();
        break;
      case 10:
        isValid = validateRelationshipPreference();
        break;
      case 11:
        isValid = validateAgreeCheckbox();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep < totalSteps) {
        nextStep();
      } else {
        handleSubmit(); // Submit the form on the last step
      }
    } else {
      Swal.fire(
        'Validation Error',
        'Please fill in all required fields before proceeding.',
        'error',
      );
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male', additionalInfo: 'Some additional info' },
    { value: 'female', label: 'Female', additionalInfo: 'More details' },
    { value: 'other', label: 'Other', additionalInfo: 'Additional information' },
  ];

  useEffect(() => {
    const checkUserProfile = () => {
      const authorId = Meteor.userId();
      if (authorId) {
        Meteor.call(
          'userProfiles.exists',
          authorId,
          (error, userProfileExists) => {
            if (error) {
              setError(
                'Error checking profile existence: ' + error.reason,
              );
            } else {
              setHasProfile(userProfileExists);
              if (userProfileExists) {
                Swal.fire({
                  title: 'Profile Exists',
                  text: 'You have already created a profile.',
                  icon: 'info',
                  confirmButtonText: 'Check some Singles',
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate('/singles');
                  }
                });
              }
            }
          },
        );
      } else {
        setError('You must be logged in to check your profile.');
      }
    };

    checkUserProfile();
  }, [navigate]);

  const nextStep = () =>
    setCurrentStep((prevStep) => Math.min(totalSteps, prevStep + 1));
  const prevStep = () =>
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  const updateFormData = (newData) =>
    setFormData((prev) => ({ ...prev, ...newData }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const authorId = Meteor.userId();
    if (!authorId) {
      setError('You must be logged in to create a profile.');
      setIsLoading(false);
      return;
    }

    const preparedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      bodyHeight: formData.bodyHeight,
      biologicalGender: formData.biologicalGender,
      personalBio: formData.personalBio,
      lookingForGender: formData.lookingForGender,
      lookingForBodyHeight: formData.lookingForBodyHeight,
      lookingForBodyType: formData.lookingForBodyType,
      agePreferenceMin: Number(formData.agePreferenceMin) || undefined,
      agePreferenceMax: Number(formData.agePreferenceMax) || undefined,
      country: formData.country,
      city: formData.city,
      profileCreatedAt: formData.profileCreatedAt,
      agreedToTerms,
      relationshipPreferences: formData.relationshipPreferences,
      disability: formData.disability,
      behavior: formData.behavior,
      interests: formData.interests.map((interest) => ({
        interestName: interest.interestName,
      })),
      likedByUsers: formData.likedByUsers,
      matches: formData.matches,
    };

    console.log('Submitting data:', preparedData);
    Meteor.call('userProfiles.create', preparedData, (error, response) => {
      setIsLoading(false);

      if (error) {
        console.error('Error creating profile:', error);
        setError(error.reason || 'An unexpected error occurred.');
      } else {
        console.log('Profile created successfully:', response);
        // Navigate to the profile-complete page
        navigate('/profile-complete');
      }
    });
  };

  // JSX for rendering the form steps
  return (
    <div className="container mx-auto p-5 min-h-screen py-32 px-8 max-w-md relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="spinner-border text-green-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <ProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        isLoading={isLoading}
        stepNames={stepNames}
      />
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentStep === 1 && (
          <PersonalDetails
            formData={formData}
            updateFormData={updateFormData}
            onNextStep={handleNextStep}
          />
        )}
        {currentStep === 2 && (
          <PersonalDetails2 formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 3 && (
          <PersonalDetails3 formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 4 && (
          <LocationDetails formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 5 && (
          <Disability formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 6 && (
          <Behavior formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 7 && (
          <Interests formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 8 && (
          <GenderPreferences
            formData={formData}
            updateFormData={updateFormData}
            options={genderOptions}
          />
        )}
        {currentStep === 9 && (
          <AgePreference formData={formData} updateFormData={updateFormData} />
        )}
        {currentStep === 10 && (
          <RelationshipPreference
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {currentStep === 11 && (
          <AgreeCheckbox
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
          />
        )}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600"
              onClick={prevStep}
            >
              Back
            </button>
          )}
          {currentStep < totalSteps && (
            <div className="flex justify-end">
              <button
                type="button"
                className={clsx(
                  'inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition duration-300 ease-in-out',
                  `bg-gradient-to-r from-teal-500
  via-emerald-500 to-lime-600 hover:shadow-lg hover:opacity-75 hover:scale-105 hover:bg-gradient-to-r hover:from-teal-400 hover:via-emerald-400 hover:to-lime-500`,
                )}
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          )}
          {currentStep === totalSteps && agreedToTerms && (
            // Only show the submit button if terms are agreed
            <button
              type="submit"
              className={`bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 ${
                isLoading || hasProfile ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isLoading || hasProfile}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
