import React, { useState, useEffect } from 'react';
import { Passwordless } from 'meteor/quave:accounts-passwordless-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoutePaths } from '../common/general/RoutePaths';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [showSuccess] = useState(false);
  const user = useTracker(() => Meteor.user());

  // State variables for form fields
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (user) {
      navigate(RoutePaths.USER_PROFILE_FORM);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (showSuccess) {
      // Reset form fields
      setEmail('');
      setPassword('');
      navigate(RoutePaths.HOME);
      Swal.fire({
        icon: 'success',
        title: 'You are welcome!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [showSuccess, navigate]);

  useEffect(() => {
    if (token) {
      Meteor.loginWithToken(token, (err) => {
        if (err) {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: err.reason || 'Could not log in with the provided token.',
            showConfirmButton: true,
          });
        } else {
          // Reset form fields
          setEmail('');
          setPassword('');
          navigate(RoutePaths.USER_PROFILE_FORM);
          Swal.fire({
            icon: 'success',
            title: 'You are welcome!',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }, [token, navigate]);


  const onEnterToken = () => {
    // Reset form fields
    setEmail('');
    setPassword('');
    navigate(RoutePaths.USER_PROFILE_FORM);
    Swal.fire({
      icon: 'success',
      title: 'You are welcome!',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // const loginWithGoogle = () => {
  //   Meteor.loginWithGoogle(
  //     { loginStyle: 'redirect', requestPermissions: ['email'], forceApprovalPrompt: true },
  //     (error) => {
  //       if (error) {
  //         // Handle login error
  //         console.error('Google login failed:', error.reason);
  //       } else {
  //         // Redirect to the desired route upon successful login
  //         navigate(RoutePaths.USER_PROFILE_FORM);
  //       }
  //     }
  //   );
  // };
  
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-8">Welcome</h2>
        <div className="custom-passwordless dark:bg-gray-700">
          <Passwordless onEnterToken={onEnterToken} className="dark:bg-gray-700" />
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        {/* <div className="space-y-4">
      <button
        className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        onClick={loginWithGoogle}
      >
        {/* Google SVG icon */}
        {/* <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.9 0 6.9 1.7 8.5 3.2l6.3-6.3C34.6 2.2 29.7 0 24 0 14.8 0 7 5.8 2.6 14.2l7.7 5.9C12.3 11.8 17.7 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 20H24v8h12.8c-1.4 7.4-8.1 12.8-15.8 12.8-9.4 0-17-7.6-17-17s7.6-17 17-17c3.9 0 6.9 1.7 8.5 3.2l6.3-6.3C34.6 2.2 29.7 0 24 0 14.8 0 7 5.8 2.6 14.2l7.7 5.9C12.3 11.8 17.7 9.5 24 9.5c9.4 0 17 7.6 17 17 0 1.1-.1 2.2-.3 3.3-.1-.6-.3-1.1-.5-1.6-.2-.6-.5-1.1-.7-1.7z"/>
          <path fill="#FBBC05" d="M10.3 28.9l-7.7-5.9C1 26.2 0 30 0 34c0 5.5 2.1 10.5 5.5 14.1l7.4-6.9c-2.3-2.2-3.6-5.3-3.6-8.6 0-.9.1-1.8.3-2.7z"/>
          <path fill="#34A853" d="M24 48c6.6 0 12.1-2.2 16.1-5.9l-7.4-6.9c-2.2 1.5-4.9 2.3-8.1 2.3-7.7 0-14.4-5.4-15.8-12.8H1.8v8.4C5.8 44.2 14.8 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg> */}

      
      </div>
    </div>
  );
};

export default LoginPage;
