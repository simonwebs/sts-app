import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  useEffect(() => {
    if (!token) {
      setConfirmationStatus('invalid-token');
      return;
    }

    Meteor.call('newsletter.confirm', token, (error, result) => {
      if (error) {
        console.error('Confirmation failed:', error);
        setConfirmationStatus('failed');
      } else {
        console.log('Confirmation status:', result.status);
        setConfirmationStatus(result.status);
      }
    });
  }, [token]);

  const redirectToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
        {confirmationStatus === 'confirmed' ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Email Confirmed</h1>
            <p className="text-gray-700 mb-4">Thank you for confirming your email address. You are now successfully subscribed to our newsletter.</p>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={redirectToHome}
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Email Confirmation Failed</h1>
            <p className="text-gray-700 mb-4">Oops! Something went wrong while confirming your email. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
