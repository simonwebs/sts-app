import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import PersonalDetails from './PersonalDetails';
import Preferences from './Preferences';
import UserProfilePhotos from './UserProfilePhotos';
import LocationDetails from './LocationDetails';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProgressBar from './ProgressBar';

// Helper function for initialization
const initializeProfilePhotos = () => Array.from({ length: 4 }, () => '');

const UserProfileForm = () => {
  // Constants
  const totalSteps = 4;
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
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
    profilePhotos: [] // Array to store the URLs of uploaded photos
  });
  
  const [profilePhotos, setProfilePhotos] = useState(initializeProfilePhotos());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUserProfile = () => {
      const authorId = Meteor.userId();
      if (authorId) {
        Meteor.call('userProfiles.exists', authorId, (error, userProfileExists) => {
          if (error) {
            setError('Error checking profile existence: ' + error.reason);
          } else {
            setHasProfile(userProfileExists);
            if (userProfileExists) {
              // If a profile exists, inform the user and redirect
              Swal.fire({
                title: 'Profile Exists',
                text: 'You have already created a profile.',
                icon: 'info',
                confirmButtonText: 'Go to Home'
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate('/');
                }
              });
            }
          }
        });
      } else {
        setError('You must be logged in to check your profile.');
      }
    };
  
    checkUserProfile();
  }, [navigate]);
  
  const nextStep = () => setCurrentStep((prevStep) => Math.min(totalSteps, prevStep + 1));
  const prevStep = () => setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  const updateFormData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));
  
    
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
      ...formData,
      agePreferenceMin: Number(formData.agePreferenceMin) || undefined,
      agePreferenceMax: Number(formData.agePreferenceMax) || undefined,
    };

    const base64Images = profilePhotos.map(photo => photo.photoUrl).filter(Boolean);

    Meteor.call('userProfiles.create', preparedData, base64Images, (error, response) => {
      setIsLoading(false);
      if (error) {
        setError(error.reason || 'An unexpected error occurred.');
        Swal.fire('Error', error.reason || 'An unexpected error occurred.', 'error');
      } else {
        Swal.fire('Success', 'Your profile has been created!', 'success');
        navigate('/'); // Redirect the user to the home page after successful creation
      }
    });
  };

  return (
    <div className="container mx-auto p-5 min-h-screen py-32 px-8 max-w-md">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} isLoading={isLoading} />
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentStep === 1 && <PersonalDetails formData={formData} updateFormData={updateFormData} />}
        {currentStep === 2 && <LocationDetails formData={formData} setFormData={updateFormData} />}
        {currentStep === 3 && <Preferences formData={formData} updateFormData={updateFormData} />}
        {currentStep === 4 && <UserProfilePhotos profilePhotos={profilePhotos} setProfilePhotos={setProfilePhotos} />}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600" onClick={prevStep}>
              Back
            </button>
          )}
          {currentStep < totalSteps && (
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600" onClick={nextStep}>
              Next
            </button>
          )}
          {currentStep === totalSteps && (
            <button type="submit" className={`bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 ${isLoading || hasProfile ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading || hasProfile}>
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
