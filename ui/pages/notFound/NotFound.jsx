import React from 'react';
import { RoutePaths } from '../../common/general/RoutePaths';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  // Common button styles for better reusability
  const commonButtonStyles = `
    inline-flex items-center px-4 py-2 border
    ring-1 ring-slate-200 dark:ring-primary_2/60 hover:ring-white dark:hover:ring-white
    text-white shadow-lg focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:inline-flex sm:w-auto sm:flex-shrink-0 sm:items-center
  `;

  return (
    <>
      <div className="mt-20 bg-gray-100 dark:bg-slate-800 min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="mx-5 -my-2 flex flex-wrap justify-center">
            <p className="text-4xl font-extrabold text-primary dark:text-cyan-500 sm:text-5xl">
              404 &nbsp;
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-center tracking-tight sm:text-5xl dark:text-primary/40">
                  Page not found
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <button
                  onClick={() => navigate(RoutePaths.HOME)}
                  className={`${commonButtonStyles}bg-primary dark:bg-opacity-90 text-gray-900 dark:text-gray-100`}
                >
                  Go back home
                </button>
                <button
                  onClick={() => navigate(RoutePaths.CONTACT_FORM)}
                  className={`${commonButtonStyles} bg-primary dark:bg-opacity-90 text-gray-900 dark:text-gray-100`}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default NotFound;
