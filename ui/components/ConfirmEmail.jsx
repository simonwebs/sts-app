// ConfirmEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [confirmationStatus, setConfirmationStatus] = useState('pending');

  useEffect(() => {
    if (!token) {
      console.log('No token provided'); // Debugging
      setConfirmationStatus('invalid-token');
      return;
    }

    Meteor.call('newsletter.confirm', token, (error, response) => {
      if (error) {
        console.log('Confirmation error:', error); // Debugging
        setConfirmationStatus('failed');
      } else {
        console.log('Confirmation response:', response); // Debugging
        setConfirmationStatus(response.status);
        if (response.status === 'confirmed' || response.status === 'already-confirmed') {
          navigate('/', { replace: true });
        }
      }
    });
  }, [token, navigate]);

  const messageMap = {
    'pending': 'Confirming your email...',
    'confirmed': 'Thank you for confirming your email address.',
    'already-confirmed': 'This email is already confirmed.',
    'failed': 'Oops! Something went wrong while confirming your email. Please try again later.',
    'invalid-token': 'Invalid token provided. Check your email for the correct link.'
  };

  return (
    <div className="email-confirmation">
      <h1>Email Confirmation</h1>
      <p>{messageMap[confirmationStatus]}</p>
    </div>
  );
};

export default ConfirmEmail;
