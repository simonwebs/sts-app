import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { CommonRoutes } from '../common/general/CommonRoutes';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/alerts/ErrorAlert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [targetUserId, setTargetUserId] = useState(''); // NEW
  const [error, setError] = useState(null);

  const resetPassword = (e) => {
    e.preventDefault();
    if (password.trim() === '') {
      toast.error('Password cannot be empty');
      return;
    }
    // Adjust logic to account for admin reset
    Accounts.adminResetPassword(token, targetUserId, password, (err) => {
      if (err) {
        toast.error(`Error: ${err.message}`);
        setError(err);
      } else {
        setPassword('');
        setError(null);
        toast.success('Password has been reset for user!');
        navigate(CommonRoutes.USER_LOGIN);
      }
    });
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h3 className="rounded-full px-3 py-2 text-lg font-medium">
          Reset User Password (Admin)
        </h3>
        {error && <ErrorAlert message={error.message || 'Unknown error'} />}
        <form className="mt-5 flex flex-col" onSubmit={resetPassword}>
          {/* New Field for Target User */}
          <label htmlFor="targetUserId" className="block text-sm font-medium text-gray-700">
            Target User ID
          </label>
          <div className="mt-1 border-b border-gray-300 focus-within:border-primary/60">
            <input
              id="targetUserId"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="flex justify-center overflow-hidden shadow-md bg-gray-700 ..."
            />
          </div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 border-b border-gray-300 focus-within:border-primary/60">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex justify-center overflow-hidden shadow-md bg-gray-700 ... "
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className="mt-5 flex justify-center text-white ..."
          >
            Set new password
          </button>
          <button
            onClick={() => navigate(CommonRoutes.HOME)}
            className="mt-5 flex justify-center text-white ..."
          >
            Back to Home
          </button>
        </form>
        <ToastContainer position="top-right" />
      </div>
    </>
  );
};

export default AdminResetPassword;
