import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { RoutePaths } from '../common/general/RoutePaths';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/alerts/ErrorAlert';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 

  const resetPassword = (e) => {
    e.preventDefault();
    if (password.trim() === '') {
      Swal.fire('Error', 'Password cannot be empty', 'error');
      return;
    }
    Accounts.resetPassword(token, password, (err) => {
      if (err) {
        Swal.fire('Error', `Error: ${err.message}`, 'error');
        setError(err);
      } else {
        setPassword('');
        setError(null);
        Swal.fire('Success', 'Your new password is set, please sign in!', 'success').then(() => {
          navigate(RoutePaths.LOGIN_PAGE);
        });
      }
    });
  };

  return (
    <>
      <div className="flex flex-col items-center dark:bg-gray-700">
        <h3 className="rounded-full px-3 py-2 text-lg font-medium">
          Reset Password
        </h3>
        {error && <ErrorAlert message={error.message || 'Unknown error'} />}
        <form className="mt-5 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-400/30 dark:ring-gray-600/30 mx-4 md:mx-0 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl" onSubmit={resetPassword}>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 border-b border-gray-300 focus-within:border-primary/60">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex justify-center overflow-hidden shadow-md bg-gray-700 dark:bg-slate-800 dark:text-white dark:hover:ring-tertiaryOne ring-1 focus:outline-0 text-gray-100 ring-primary/20 dark:ring-primary/50 hover:ring-primary rounded-t-lg py-1.5 px-4 text-sm"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className="mt-5 flex justify-center text-white rounded-md px-3 py-2 font-semibold overflow-hidden bg-primary/70 dark:bg-slate-800 ring-1 ring-primary/10 dark:ring-slate-600/60 hover:ring-primary/20 dark:hover:ring-tertiaryOne opacity-90 shadow-lg focus:ring-offset-1 hover:ring-slate-500 dark:hover:ring-white dark:text-tertiaryOne cursor-pointer"
          >
            Set new password
          </button>
          <button
            onClick={() => navigate(RoutePaths.HOME)}
            className="mt-5 flex justify-center text-white rounded-md px-3 py-2 font-semibold overflow-hidden bg-primary/70 dark:bg-slate-800 ring-1 ring-primary/10 dark:ring-slate-600/60 hover:ring-primary/20 dark:hover:ring-tertiaryOne opacity-90 shadow-lg focus:ring-offset-1 hover:ring-slate-500 dark:hover:ring-white dark:text-tertiaryOne cursor-pointer"
          >
            Back to Home
          </button>
        </form>
      </div>
    </>
  );
};
export default ResetPassword;
