import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { ErrorAlert } from '../components/alerts/ErrorAlert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState();

  const forgotPassword = (e) => {
    e.preventDefault();
    Accounts.forgotPassword({ email }, (error) => {
      if (error) {
        Swal.fire('Error', 'Error requesting the link to create new password', 'error');
        setError(error);
        return;
      }
      setEmail('');
      setError(null);
      Swal.fire('Success', 'You should recieve a reset email alert shortly!', 'success');
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    sendResetPasswordEmail(email);
  };

  return (
    <div className="mt-32 flex flex-col items-center dark:bg-gray-700 h-screen">
      <h3 className="rounded-full px-3 py-2 font-medium cursor-pointer text-primary dark:text-gray-100">
        Forgot Password
      </h3>
      {error && <ErrorAlert message={error.reason || 'Unknown error'} />}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-400/30 dark:ring-gray-600/30 mx-4 md:mx-0 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-primary dark:text-gray-100">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="example@gmail.com"
            />
          </div>
        </div>
        <div className="mb-6">
          <button
            onClick={forgotPassword}
            type="submit"
            className="py-2 px-4 font-serif font-medium text-lg text-white bg-primary rounded-lg outline-none hover:text-white hover:bg-opacity-70 transition ease-in-out duration-150"
          >
            Send Reset Link
          </button>
        </div>
        <div>
          <Link to={'/login'} className="block font-medium text-primary dark:text-gray-100 hover:text-primary/50 hover:underline">
            Back to Sign Up
          </Link>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: '60px' }} // Add margin-top to push the toast container down
      />
    </div>
  );
};
export default ForgotPassword;
